class OrderStatusService {
    constructor() {
        this.statusSteps = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];
        this.currentStatus = 0;
        this.updateInterval = null;
    }

    startTracking(orderId) {
        // Clear any existing intervals
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Simulate real-time updates
        this.updateInterval = setInterval(() => {
            if (this.currentStatus < this.statusSteps.length - 1) {
                this.currentStatus++;
                this.emitStatusUpdate();
            } else {
                clearInterval(this.updateInterval);
            }
        }, 5000); // Update every 5 seconds
    }

    emitStatusUpdate() {
        const event = new CustomEvent('orderStatusChanged', {
            detail: {
                status: this.currentStatus,
                statusText: this.statusSteps[this.currentStatus],
                timestamp: new Date().toLocaleTimeString()
            }
        });
        document.dispatchEvent(event);
    }

    stopTracking() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}
