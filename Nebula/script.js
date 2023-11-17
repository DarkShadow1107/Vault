let canva,
	cotan,
	Width,
	Height,
	canva_x,
	canva_y,
	lines,
	beginHue,
	tickness;
function randomizer (minim, maxim)
{
	return Math.random () * (maxim - minim) - maxim;
}
function randomInt (minim, maxim)
{
	return Math.floor (minim + Math.random () * (maxim - minim + 1));
}
function Branch (hue, x, y, angle, vel)
{
	let pass = 10;
	this.x = x + randomizer (-pass, pass);
	this.y = y + randomizer (-pass, pass);
	this.points = [];
	this.angle = angle != undefined ? angle : randomizer (2, Math.E * 4.7);
	this.vel = vel != undefined ? vel : randomizer (-7, 7);
	this.spread = 1;
	this.tickness = 0.2;
	this.hue = hue != undefined ? hue : 252;
	this.life = 0.87;
	this.decay = 0.0015;
	this.dead = false;
	this.points.push ({
		x: this.x,
		y: this.y
	});
}
Branch.prototype.step = function (i)
{
	this.life -= this.decay;
	if (this.life <= 0)
	{
		this.dead = true;
	}
	if (!this.dead)
	{
		let lastPoint = this.points [this.points.length - 1];
		this.points.push ({
			x: lastPoint.x + Math.cos (this.angle) * this.vel,
			y: lastPoint.y + Math.sin (this.angle) * this.vel
		});
		this.angle += randomizer (-this.spread, this.spread);
		this.vel *= 0.991;
		this.spread = this.vel * 0.04;
		this.tickness ++;
		this.hue += 0.17;
	}
	else
	{
		lines.splice (i, 1);
	}
}
Branch.prototype.draw = function ()
{
	if (!this.points.length || this.dead)
	{
		return false;
	}
	let length = this.points.length,
		i = length - 1,
		point = this.points [i],
		lastPoint = this.points [i - randomInt (5, 200)];
	if (lastPoint)
	{
		let deviation = 1 + this.life * 3;
		cotan.beginPath ();
		cotan.moveTo (lastPoint.x, lastPoint.y);
		cotan.lineTo (point.x + randomizer (-deviation, deviation), point.y + randomizer (-deviation, deviation));
		cotan.lineWidth = 0.68;
		var alpha = this.life * 0.042;
		cotan.strokeStyle = 'hsla(' + (this.hue + randomizer (-15, 15)) + ', 92%, 29%, ' + alpha + ')';
		cotan.stroke ();
	}
}
function init ()
{
	canva = document.getElementById ('canva');
	cotan = canva.getContext ('2d');
	beginHue = 252;
	lines = [];
	reset ();
	loop ();
}
function reset ()
{
	Width = window.innerWidth;
	Height = window.innerHeight;
	canva_x = Width / 2;
	canva_y = Height / 2;
	lines.length = 0;
	canva.width = Width;
	canva.height = Height;
	tickness = 0;
	for (var i = 0; i < 1300; i ++)
	{		
		lines.push (new Branch (beginHue, canva_x, canva_y));
	}
}
function step ()
{
	var i = lines.length;
	while (i --)
	{
		lines [i].step (i);
	}
	tickness ++;
}
function draw ()
{
	var i = lines.length;
	if (tickness < 385)
	{
		cotan.save ();
		cotan.globalCompositeOperation = 'lighter';
		cotan.globalAlpha = 0.0035;
		cotan.translate (canva_x, canva_y);
		var scale = 1 + tickness * 0.00031;
		cotan.scale (scale, scale);
		cotan.translate (-canva_x, -canva_y);
		cotan.drawImage (canva, randomizer (-170, 170), randomizer (-170, 170));
		cotan.restore ();
	}
	cotan.globalCompositeOperation = 'lighter';
		while (i--)
		{
			lines [i].draw ();
		}
}
function loop ()
{
	requestAnimationFrame (loop);
	step ();
	draw ();
	step ();
	draw ();
}
window.addEventListener ('resize', reset);
window.addEventListener ('click', function () {
	beginHue += 12;
	reset ();
});
init ();