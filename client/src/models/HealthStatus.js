export class HealthStatus {
  constructor(status) {
    this.status = status;
  }

  get isHealthy() {
    return this.status === 'ok';
  }

  static fromJson(json) {
    return new HealthStatus(json.status);
  }
}
