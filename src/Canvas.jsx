import React, { useRef, useEffect } from "react";

const Canvas = ({
  circle1Speed,
  circle2Speed,
  circle1FireRate,
  circle2FireRate,
  circle1BulletColor,
  circle2BulletColor,
  onHit,
  onCircleClick,
}) => {
  const canvasRef = useRef(null);
  const circlesRef = useRef([
    {
      x: 100,
      y: 100,
      radius: 30,
      dy: circle1Speed,
      color: "blue",
      bulletColor: circle1BulletColor,
      bullets: [],
      fireRate: circle1FireRate,
      lastShotTime: Date.now(),
    },
    {
      x: 1100,
      y: 500,
      radius: 30,
      dy: circle2Speed,
      color: "red",
      bulletColor: circle2BulletColor,
      bullets: [],
      fireRate: circle2FireRate,
      lastShotTime: Date.now(),
    },
  ]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastFrameTimeRef = useRef(Date.now());

  useEffect(() => {
    const [circle1, circle2] = circlesRef.current;
    circle1.dy = circle1Speed;
    circle1.fireRate = circle1FireRate;
    circle1.bulletColor = circle1BulletColor;
    circle2.dy = circle2Speed;
    circle2.fireRate = circle2FireRate;
    circle2.bulletColor = circle2BulletColor;
  }, [
    circle1Speed,
    circle2Speed,
    circle1FireRate,
    circle2FireRate,
    circle1BulletColor,
    circle2BulletColor,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const circles = circlesRef.current;

    const canvasWidth = 1200;
    const canvasHeight = 600;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const { x: mouseX, y: mouseY } = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      circles.forEach((circle, index) => {
        const dx = circle.x - mouseX;
        const dy = circle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle.radius) {
          if (onCircleClick) onCircleClick(index);
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    const drawBorder = () => {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    };

    drawBorder();

    const drawCircles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBorder();

      circles.forEach((circle) => {
        ctx.fillStyle = circle.color;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();

        circle.bullets.forEach((bullet) => {
          ctx.fillStyle = bullet.color;
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    };

    const updateCirclesAndBullets = () => {
      const { x: mouseX, y: mouseY } = mousePosRef.current;

      circles.forEach((circle, index) => {
        circle.y += circle.dy;

        if (circle.y + circle.radius > canvas.height) {
          circle.y = canvas.height - circle.radius;
          circle.dy = -circle.dy;
        } else if (circle.y - circle.radius < 0) {
          circle.y = circle.radius;
          circle.dy = -circle.dy;
        }

        const dx = circle.x - mouseX;
        const dy = circle.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < circle.radius && distance >= circle.radius - 5) {
          circle.dy = -circle.dy;
        }

        circle.bullets.forEach((bullet, bulletIndex) => {
          bullet.x += bullet.dx;
          bullet.y += bullet.dy;

          circles.forEach((targetCircle, targetIndex) => {
            if (index !== targetIndex) {
              const hitDx = bullet.x - targetCircle.x;
              const hitDy = bullet.y - targetCircle.y;
              const hitDistance = Math.sqrt(hitDx * hitDx + hitDy * hitDy);

              if (hitDistance < targetCircle.radius) {
                console.log("HIT");
                circle.bullets.splice(bulletIndex, 1);
                if (onHit) onHit(targetIndex);
              }
            }
          });
        });

        circle.bullets = circle.bullets.filter(
          (bullet) =>
            bullet.x >= 0 &&
            bullet.x <= canvas.width &&
            bullet.y >= 0 &&
            bullet.y <= canvas.height
        );
      });
    };

    const shootBullets = () => {
      const now = Date.now();

      circles.forEach((circle, index) => {
        if (now - circle.lastShotTime >= circle.fireRate) {
          circle.lastShotTime = now;

          const targetCircle = circles[index === 0 ? 1 : 0];

          const dx = targetCircle.x - circle.x;
          const dy = targetCircle.y - circle.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const unitDx = dx / length;
          const unitDy = dy / length;

          circle.bullets.push({
            x: circle.x,
            y: circle.y,
            dx: unitDx * 5,
            dy: unitDy * 5,
            color: circle.bulletColor,
          });
        }
      });
    };

    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastFrameTimeRef.current;

      if (deltaTime >= 1000 / 60) {
        updateCirclesAndBullets();
        shootBullets();
        drawCircles();
        lastFrameTimeRef.current = now;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    onHit,
    onCircleClick,
    circle1Speed,
    circle2Speed,
    circle1FireRate,
    circle2FireRate,
    circle1BulletColor,
    circle2BulletColor,
  ]);

  return <canvas ref={canvasRef} />;
};

export default Canvas;
