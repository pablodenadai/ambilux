'use strict';

var robot = require('robotjs');
var averageColour = require('average-colour');

var screenSize = robot.getScreenSize();

var defaultConfig = {
	screenHeight: screenSize.height,
	screenWidth: screenSize.width,
	ledsHorizontal: 10,
	ledsVertical: 7,
	pixelGap: 25,
	screenOffset: 0.1,
	refreshInterval: 100
};

class Ambilux {
	constructor(config) {
		this.config = config;

		// sourcePixels = [top, right, bottom, left]
		this._sourcePixels = [
			{x: 0, y: config.screenHeight * config.screenOffset},
			{x: config.screenWidth - config.screenWidth * config.screenOffset, y: 0},
			{x: 0, y: config.screenHeight - config.screenHeight * config.screenOffset},
			{x: config.screenWidth * config.screenOffset, y: 0}
		];
	}

	run(config, cb) {
		Object.assign(this.config, config);

		return setInterval(() => {
			cb(this._sourcePixels
				.map(this._pixelList.bind(this))
				.map(this._pixelColoredList.bind(this))
				.map(this._averageColoredList.bind(this)));
		}, this.config.refreshInterval);
	}

	_pixelList(pixel, index) {
		var i = 0;
		var result = [];
		var length = pixel.x ? this.config.screenHeight : this.config.screenWidth;

		for (i; i < length; i += this.config.pixelGap) {
			var x = pixel.x ? pixel.x : i;
			var y = pixel.y ? pixel.y : i;

			result.push({x, y});
		}

		if (index > 1) {
			result.reverse();
		}

		return result;
	}

	_pixelColoredList(pixels) {
		return pixels.map(pixel => {
			pixel.hex = '#' + robot.getPixelColor(pixel.x, pixel.y);
			return pixel;
		});
	}

	_averageColoredList(pixels, index) {
		var i = 0;
		var result = [];
		var numberOfLeds = (index % 2) ? this.config.ledsVertical : this.config.ledsHorizontal;
		var pixelsPerLed = Math.floor(pixels.length / numberOfLeds);
		var pixelsLeftOver = pixels.length % numberOfLeds;

		for (i; i < numberOfLeds; i++) {
			var pixelLeftOver = pixelsLeftOver > 0 ? 1 : 0;
			pixelsLeftOver--;

			var hex = averageColour(
				pixels.splice(0, pixelsPerLed + pixelLeftOver)
					.map(pixel => pixel.hex)
			);

			result.push(hex);
		}

		return result;
	}
}

module.exports = new Ambilux(defaultConfig);
