// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BookingReservation {
    struct Slot {
        address provider;
        address customer;
        bool isBooked;
        string serviceName;
        uint256 date;
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        string status; // "available", "booked", "completed", "cancelled"
    }

    mapping(string => Slot) public slots;
    string[] public slotIds;
    uint256 public slotCount;

    error InvalidServiceName();
    error InvalidTimeRange();
    error AlreadyExists();
    error NotFound();
    error AlreadyBooked();
    error NotBooked();
    error Unauthorized();
    error InvalidStatus();

    function createSlot(
        string memory id,
        string memory serviceName,
        uint256 date,
        uint256 startTime,
        uint256 endTime,
        uint256 price
    ) public {
        if (bytes(serviceName).length == 0) revert InvalidServiceName();
        if (startTime >= endTime) revert InvalidTimeRange();
        
        if (slots[id].provider != address(0)) revert AlreadyExists();

        slots[id] = Slot({
            provider: msg.sender,
            customer: msg.sender, // Default to provider initially
            isBooked: false,
            serviceName: serviceName,
            date: date,
            startTime: startTime,
            endTime: endTime,
            price: price,
            status: "available"
        });

        slotIds.push(id);
        slotCount++;
    }

    function bookSlot(string memory id) public {
        if (slots[id].provider == address(0)) revert NotFound();
        if (slots[id].isBooked) revert AlreadyBooked();

        slots[id].customer = msg.sender;
        slots[id].isBooked = true;
        slots[id].status = "booked";
    }

    function cancelBooking(string memory id) public {
        if (slots[id].provider == address(0)) revert NotFound();
        if (!slots[id].isBooked) revert NotBooked();
        if (msg.sender != slots[id].provider && msg.sender != slots[id].customer) revert Unauthorized();

        slots[id].isBooked = false;
        slots[id].status = "cancelled";
    }

    function completeBooking(string memory id) public {
        if (slots[id].provider == address(0)) revert NotFound();
        if (msg.sender != slots[id].provider) revert Unauthorized();
        if (!slots[id].isBooked) revert NotBooked();

        slots[id].status = "completed";
    }

    function getSlot(string memory id) public view returns (Slot memory) {
        if (slots[id].provider == address(0)) revert NotFound();
        return slots[id];
    }

    function listSlots() public view returns (string[] memory) {
        return slotIds;
    }

    function getSlotCount() public view returns (uint256) {
        return slotCount;
    }
}
