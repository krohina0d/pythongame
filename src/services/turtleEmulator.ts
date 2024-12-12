interface TurtleState {
  x: number;
  y: number;
  angle: number;
  isDown: boolean;
  color: string;
}

class TurtleEmulator {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private state: TurtleState;

  constructor(canvasId: string) {
    this.state = {
      x: 0,
      y: 0,
      angle: 0,
      isDown: true,
      color: '#000000'
    };

    setTimeout(() => {
      this.initCanvas(canvasId);
    }, 0);
  }

  private initCanvas(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      if (this.ctx) {
        this.state.x = this.canvas.width / 2;
        this.state.y = this.canvas.height / 2;
        this.reset();
      }
    }
  }

  reset() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.state = {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        angle: 0,
        isDown: true,
        color: '#000000'
      };
    }
  }

  forward(distance: number) {
    if (!this.ctx) return;

    const newX = this.state.x + distance * Math.cos(this.state.angle * Math.PI / 180);
    const newY = this.state.y + distance * Math.sin(this.state.angle * Math.PI / 180);

    if (this.state.isDown) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.state.x, this.state.y);
      this.ctx.lineTo(newX, newY);
      this.ctx.strokeStyle = this.state.color;
      this.ctx.stroke();
    }

    this.state.x = newX;
    this.state.y = newY;
  }

  right(angle: number) {
    this.state.angle += angle;
  }

  left(angle: number) {
    this.state.angle -= angle;
  }

  penUp() {
    this.state.isDown = false;
  }

  penDown() {
    this.state.isDown = true;
  }

  color(color: string) {
    this.state.color = color;
  }

  circle(radius: number) {
    if (!this.ctx) return;

    const startX = this.state.x;
    const startY = this.state.y;
    
    this.ctx.beginPath();
    this.ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = this.state.color;
    this.ctx.stroke();
  }
}

export const createTurtle = (canvasId: string) => new TurtleEmulator(canvasId); 