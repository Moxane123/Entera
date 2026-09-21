// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EnteraRegistry
 * @notice Canonical registry for verified decentralized web applications on Arbitrum.
 * @dev Stores minimal, high-integrity on-chain proofs:
 *      - Ownership: The verified team/creator address authorized to manage destination & metadata.
 *      - Destination Integrity: Hash/canonical URL to prevent domain hijacking & phishing.
 *      - Metadata Reference: IPFS/Arweave URI pointing to rich off-chain entry content.
 *      - Version Tracking: Sequential monotonic revisions on every update.
 *      - Active / Inactive Status: Clear operational flag.
 *
 * Requirements & Invariants:
 * - Immutable Entry IDs: Once created, an Entry ID belongs to its creator and cannot be overwritten.
 * - Owner-only updates: Only the designated creator owner address can update or change status.
 * - Input validation: Enforces non-zero ID, destination hash, and metadata URI.
 * - Monotonic version tracking: Revisions increment by 1 on each destination/metadata update.
 * - Useful event emissions: Emits EntryCreated, EntryUpdated, EntryStatusChanged for indexers.
 * - No funds held: Rejects any ETH or value transfer (no payable functions).
 * - Zero tokens, NFTs, staking, payments, or governance.
 */
contract EnteraRegistry {
    /// @notice Core on-chain record for a registered Entera entry
    struct Entry {
        bytes32 entryId;         // Immutable unique identifier hash
        address owner;           // Authorized owner address
        string destinationHash;  // Canonical destination URL or cryptographic hash
        string metadataUri;      // IPFS/Arweave URI pointing to rich offchain schema
        uint256 version;         // Monotonically increasing revision number
        bool isActive;           // Active or Inactive status
        uint256 createdAt;       // Block timestamp of entry registration
        uint256 updatedAt;       // Block timestamp of latest revision
    }

    /// @dev Mapping from entryId hash to Entry record
    mapping(bytes32 => Entry) private _entries;

    /// @dev Sequential list of all registered entry IDs for enumeration
    bytes32[] private _allEntryIds;

    // ----------------------------------------------------
    // Events
    // ----------------------------------------------------
    event EntryCreated(
        bytes32 indexed entryId,
        address indexed owner,
        string destinationHash,
        string metadataUri,
        uint256 version,
        uint256 timestamp
    );

    event EntryUpdated(
        bytes32 indexed entryId,
        address indexed owner,
        string destinationHash,
        string metadataUri,
        uint256 newVersion,
        uint256 timestamp
    );

    event EntryStatusChanged(
        bytes32 indexed entryId,
        address indexed owner,
        bool indexed isActive,
        uint256 timestamp
    );

    // ----------------------------------------------------
    // Custom Errors
    // ----------------------------------------------------
    error EntryAlreadyExists(bytes32 entryId);
    error EntryDoesNotExist(bytes32 entryId);
    error NotEntryOwner(bytes32 entryId, address caller);
    error InvalidEntryId();
    error InvalidDestination();
    error InvalidMetadataUri();
    error NoEtherAccepted();

    // ----------------------------------------------------
    // Guard against accidental ETH deposits
    // ----------------------------------------------------
    receive() external payable {
        revert NoEtherAccepted();
    }

    fallback() external payable {
        revert NoEtherAccepted();
    }

    // ----------------------------------------------------
    // Core Functions
    // ----------------------------------------------------

    /**
     * @notice Registers a new canonical entry.
     * @param entryId The unique immutable ID (bytes32 format).
     * @param destinationHash Canonical URL string or cryptographic hash.
     * @param metadataUri URI pointing to the off-chain rich JSON descriptor.
     */
    function createEntry(
        bytes32 entryId,
        string calldata destinationHash,
        string calldata metadataUri
    ) external {
        if (entryId == bytes32(0)) revert InvalidEntryId();
        if (bytes(destinationHash).length == 0) revert InvalidDestination();
        if (bytes(metadataUri).length == 0) revert InvalidMetadataUri();
        if (_entries[entryId].owner != address(0)) revert EntryAlreadyExists(entryId);

        Entry memory newEntry = Entry({
            entryId: entryId,
            owner: msg.sender,
            destinationHash: destinationHash,
            metadataUri: metadataUri,
            version: 1,
            isActive: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        _entries[entryId] = newEntry;
        _allEntryIds.push(entryId);

        emit EntryCreated(
            entryId,
            msg.sender,
            destinationHash,
            metadataUri,
            1,
            block.timestamp
        );
    }

    /**
     * @notice Updates the destination reference and metadata URI. Owner-only.
     * @dev Automatically increments the version number.
     * @param entryId The immutable entry identifier.
     * @param newDestinationHash The new destination URL or hash.
     * @param newMetadataUri The updated off-chain metadata URI.
     */
    function updateEntry(
        bytes32 entryId,
        string calldata newDestinationHash,
        string calldata newMetadataUri
    ) external {
        Entry storage entry = _entries[entryId];
        if (entry.owner == address(0)) revert EntryDoesNotExist(entryId);
        if (msg.sender != entry.owner) revert NotEntryOwner(entryId, msg.sender);
        if (bytes(newDestinationHash).length == 0) revert InvalidDestination();
        if (bytes(newMetadataUri).length == 0) revert InvalidMetadataUri();

        entry.destinationHash = newDestinationHash;
        entry.metadataUri = newMetadataUri;
        entry.version += 1;
        entry.updatedAt = block.timestamp;

        emit EntryUpdated(
            entryId,
            entry.owner,
            newDestinationHash,
            newMetadataUri,
            entry.version,
            block.timestamp
        );
    }

    /**
     * @notice Toggles or sets the active or inactive status of an entry. Owner-only.
     * @param entryId The immutable entry identifier.
     * @param isActive True for active, false for inactive.
     */
    function setStatus(bytes32 entryId, bool isActive) external {
        Entry storage entry = _entries[entryId];
        if (entry.owner == address(0)) revert EntryDoesNotExist(entryId);
        if (msg.sender != entry.owner) revert NotEntryOwner(entryId, msg.sender);

        entry.isActive = isActive;
        entry.updatedAt = block.timestamp;

        emit EntryStatusChanged(entryId, entry.owner, isActive, block.timestamp);
    }

    /**
     * @notice Public view function to read an entry without connecting a wallet.
     * @param entryId The unique identifier of the entry.
     */
    function getEntry(bytes32 entryId) external view returns (
        bytes32 id,
        address owner,
        string memory destinationHash,
        string memory metadataUri,
        uint256 version,
        bool isActive,
        uint256 createdAt,
        uint256 updatedAt
    ) {
        Entry memory entry = _entries[entryId];
        if (entry.owner == address(0)) revert EntryDoesNotExist(entryId);

        return (
            entry.entryId,
            entry.owner,
            entry.destinationHash,
            entry.metadataUri,
            entry.version,
            entry.isActive,
            entry.createdAt,
            entry.updatedAt
        );
    }

    /**
     * @notice Checks if an entry is registered.
     */
    function entryExists(bytes32 entryId) external view returns (bool) {
        return _entries[entryId].owner != address(0);
    }

    /**
     * @notice Returns the total count of registered entries.
     */
    function totalEntries() external view returns (uint256) {
        return _allEntryIds.length;
    }

    /**
     * @notice Returns the entry ID at a given index in the registry.
     */
    function entryIdAtIndex(uint256 index) external view returns (bytes32) {
        return _allEntryIds[index];
    }
}
