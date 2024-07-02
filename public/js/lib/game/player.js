class Player {
  constructor(socketId, name) {
    this.socketId = socketId;
    this.name = name;
    this.score = 0;
    this.powerUps = [];
    this.appliedPowers = [];
    this.coordinates = {
      x: null,
      y: null,
    };
  }

  addScore(points) {
    this.score += points;
  }

  applyPower(power, seconds) {
    this.appliedPowers.push({
      power: power,
      seconds: seconds,
      from: new Date(),
    });
  }

  usePowerUp(powerUp) {
    const powerUpIndex = this.powerUps.findIndex(powerUp);
    if (powerUpIndex != -1) {
      this.powerUps.splice(powerUpIndex);
    }
  }

  getPowerUp(powerUp) {
    this.powerUps.push(powerUp);
  }
}
