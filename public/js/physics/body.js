
class Vector {

    constructor({
        x, y, z
    }) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.r = Vector.getMagnitude({
            x: this.x,
            y: this.y,
            z: this.z
        });
        this.alpha = Math.acos(this.x / this.r);
        this.beta = Math.acos(this.y / this.r);
        this.gamma = Math.acos(this.z / this.r);
    }

    static getMagnitude({ x, y, z }) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    }

    static getPosition({
        magnitude,
        gamma,
        beta,
        alpha
    }) {
        return ({
            x: magnitude * Math.cos(alpha),
            y: magnitude * Math.cos(beta),
            z: magnitude * Math.cost(gamma)
        })
    }

    static getAngles({
        x,
        y,
        z
    }) {
        r = this.getMagnitude({ x, y, z });
        return ({
            r,
            alpha: Math.acos(x / r),
            beta: Math.acos(y / r),
            gamma: Math.acos(z / r),
        })
    }

    static sumVectors(vectorA, vectorB) {
        return new Vector({
            x: vectorA.x + vectorB.x,
            y: vectorA.y + vectorB.y,
            z: vectorA.z + vectorB.z,
        })
    }

    static scalarMultiply({
        scalar,
        vector
    }) {
        return new Vector({
            x: scalar * vector.x,
            y: scalar * vector.y,
            z: scalar * vector.z,
        })
    }

    static slopedVector({
        vector,
        gamma,
        beta,
        alpha
    }) {
        const r = Vector.getMagnitude({
            x: vector.x,
            y: vector.y,
            z: vector.z
        })

        return new Vector({
            x: r * Math.cos(alpha ?? vector.alpha),
            y: r * Math.cos(beta ?? vector.beta),
            z: r * Math.cos(gamma ?? vector.gamma)
        })
    }

    toString() {
        return `Vector: <x:${this.x}, y:${this.y}, z:${this.z}>`
    };

}

class Body {

    static gravityVector = new Vector({
        x: 0,
        y: 0,
        z: -9.8,
    })

    constructor({
        position: {
            x,
            y,
            z
        },
        mass
    }) {
        this.position = new Vector({ x, y, z });
        this.mass = mass;
        // body is initially stationary.
        this.acceleration = new Vector({ x: 0, y: 0, z: 0 });
        this.velocity = new Vector({ x: 0, y: 0, z: 0 });
    }

    applyForce(forceVector) {
        this.acceleration = Vector.scalarMultiply({ scalar: (1 / this.mass), vector: forceVector });
    }

    applyAcceleration(accelerationVector, elapsedTime) {
        this.velocity = Vector.scalarMultiply({ scalar: elapsedTime, vector: accelerationVector })
    }

    applyVelocity(elapsedTime) {
        this.position = Vector.sumVectors(Vector.scalarMultiply({
            scalar: elapsedTime,
            vector: this.velocity,
        }), this.position);
    }

    applyBounds({
        xMin, xMax, yMin, yMax, zMin, zMax
    }) {
        this.position.x = Math.min(Math.max(this.position.x, xMin), xMax);
        this.position.y = Math.min(Math.max(this.position.y, yMin), yMax);
        this.position.z = Math.min(Math.max(this.position.z, zMin), zMax);
    }

}


function main() {
    let ball = new Body({
        position: {
            x: 0,
            y: 0,
            z: 20
        },
        mass: 1
    });

    const timeIntervals = 1

    console.log(`Position: x:${ball.position.x} y:${ball.position.y} z:${ball.position.z}`)
    setInterval(() => {

        ball.applyForce(Vector.slopedVector({
            vector: Body.gravityVector,
            beta: 30
        }));
        ball.applyAcceleration(ball.acceleration, timeIntervals);
        ball.applyVelocity(timeIntervals)
        ball.applyBounds({
            xMin: 0,
            xMax: 200,
            yMin: 0,
            yMax: 200,
            zMin: 0,
            zMax: 200
        })

        console.log(`Position: x:${ball.position.x} y:${ball.position.y} z:${ball.position.z}`)
    }, timeIntervals * 1000);

}

main();