// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ShmooPoints
 * @dev A simple contract for generating non-transferable Shmoo points
 * WARNING: These points have no monetary value and are non-transferable
 */
contract ShmooPoints {
    struct ShmooPoint {
        address user;
        uint256 timestamp;
        uint256 pointId;
    }
    
    // Mapping from user address to their points
    mapping(address => ShmooPoint[]) public userPoints;
    
    // Mapping from user address to their stats
    mapping(address => uint256) public totalClicks;
    
    // Total points generated across all users
    uint256 public totalPointsGenerated;
    
    // Events
    event ShmooPointGenerated(
        address indexed user,
        uint256 indexed pointId,
        uint256 timestamp
    );
    
    /**
     * @dev Generate a new Shmoo point for the caller
     * This function creates a non-transferable point on-chain
     */
    function generateShmooPoint() external {
        uint256 pointId = totalPointsGenerated + 1;
        uint256 timestamp = block.timestamp;
        
        // Create the point
        ShmooPoint memory newPoint = ShmooPoint({
            user: msg.sender,
            timestamp: timestamp,
            pointId: pointId
        });
        
        // Store the point
        userPoints[msg.sender].push(newPoint);
        totalClicks[msg.sender]++;
        totalPointsGenerated++;
        
        // Emit event
        emit ShmooPointGenerated(msg.sender, pointId, timestamp);
    }
    
    /**
     * @dev Get the total number of points for a user
     */
    function getUserPointCount(address user) external view returns (uint256) {
        return userPoints[user].length;
    }
    
    /**
     * @dev Get a specific point for a user by index
     */
    function getUserPoint(address user, uint256 index) 
        external 
        view 
        returns (ShmooPoint memory) 
    {
        require(index < userPoints[user].length, "Point index out of bounds");
        return userPoints[user][index];
    }
    
    /**
     * @dev Get all points for a user (be careful with gas limits)
     */
    function getUserPoints(address user) 
        external 
        view 
        returns (ShmooPoint[] memory) 
    {
        return userPoints[user];
    }
    
    /**
     * @dev Get the latest point for a user
     */
    function getLatestUserPoint(address user) 
        external 
        view 
        returns (ShmooPoint memory) 
    {
        require(userPoints[user].length > 0, "User has no points");
        return userPoints[user][userPoints[user].length - 1];
    }
}
