import React, { useEffect, useState } from "react";
import "./App.css";

// interpolate between predefined colors in an array
type Color = [number, number, number];
const colorsArray: [number, Color][] = [
  [-10, [0, 0, 255]],
  [10, [4, 226, 211]],
  [30, [238, 255, 0]],
  [50, [255, 0, 0]],
];

// takes 2 colors and an an alpha value, interpolates between their rgb value using the alpha, returns new color
const colorLerp = (color1: Color, color2: Color, alpha: number): Color => {
  //              scale
  // color1 ---------------color2

  //color2[0]-color1[0] calculates the relative "scale" for said color channel
  //multiplied by alpha (number between 0 and 1) gives us the percentage of where we are in the "scale"
  //+color1[0] makes the "scale" START at color1[0], and add the percentage to that, correctly giving us the new color on the scale
  const red = (color2[0] - color1[0]) * alpha + color1[0];
  const green = (color2[1] - color1[1]) * alpha + color1[1];
  const blue = (color2[2] - color1[2]) * alpha + color1[2];

  return [red, green, blue];
};

const minTemperature = -50;
const maxTemperature = 60;

const minScaleTemperature = -10;
const maxScaleTemperature = 40;
const scale = maxScaleTemperature - minScaleTemperature;

//variable that defines the intervals between temperatures. stepSize = 2, temperatures will be 0,2,4...
const stepSize = 5;

const TemperatureControl = () => {
  const [temperature, setTemperature] = useState(15);

  const [bgColor, setBgColor] = useState("");
  const [softerBgColor, setSofterBgColor] = useState("");
  //when temperature is changed, useEffect runs and sets a new bg color
  useEffect(() => {
    //defaults to the first element in the colosArray
    const stops = [colorsArray[0], colorsArray[0]];

    //loops through colosArray, which is (  [temperatureThreshold, [r,g,b]] ). checks if current temperature is higher or equal the checked temperatureThreshold. If yes, then substitute the default stops array with the first element being the current colorsArray element, and the second being the the next colorsArray element.

    //this stores the current 2 temperatures and colors which will be used to find where we are in the temperature scale and find the bg color which correspond to that.
    for (let i = 0; i < colorsArray.length; i++) {
      if (temperature >= colorsArray[i][0]) {
        stops[0] = colorsArray[i];
        stops[1] = colorsArray[i + 1] ?? stops[0];
      }
    }

    //gives us a value between 0 and 1, which represents where we are in the scale of the 2 temperature values found in the previous for loop. will be used as the "alpha value in the colorLerp function"
    const stopsPercentage = Math.min(
      1,
      Math.max(0, (temperature - stops[0][0]) / (stops[1][0] - stops[0][0]))
    );

    //calls the colorLerp function with the first and second colors on the "stops" scale, as well as the stopsPercentage. This will give us the new color [r,g,b] to be used as the bg color
    const newColor = colorLerp(stops[0][1], stops[1][1], stopsPercentage);

    //sets the rgb channels for new bg color
    setBgColor(`rgb(${newColor[0]},${newColor[1]},${newColor[2]})`);
    setSofterBgColor(`rgb(${newColor[0]},${newColor[1]},${newColor[2]},0.2)`);
  }, [temperature]);

  const renderTemperature = () => {
    if (temperature === 50) {
      return <p>too hot!🥵</p>;
    } else if (temperature === -10) {
      return <p>too cold!🥶</p>;
    } else return temperature;
  };

  return (
    <div className="page-container" style={{ backgroundColor: softerBgColor }}>
      <div className="app-container">
        <h1 className="app-title">Pick your temperature:</h1>

        {/* on the style property, the bg color is set, and updated when the temperature changes */}
        <div
          className="temp-container"
          style={{
            backgroundColor: bgColor,
            boxShadow: `  0 0 20px 20px ${softerBgColor} `,
          }}
        >
          {temperature > 20 && temperature < 36 ? (
            <p className="temperature">{renderTemperature()}</p>
          ) : (
            <p className="temperature temperature-white">
              {renderTemperature()}
            </p>
          )}
        </div>
        <div className="buttons">
          <button
            onClick={() => {
              setTemperature((previousTemp) =>
                previousTemp <= -10 ? -10 : previousTemp - stepSize
              );
            }}
          >
            -
          </button>
          <button
            onClick={() => {
              setTemperature((previousTemp) =>
                previousTemp >= 50 ? 50 : previousTemp + stepSize
              );
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemperatureControl;
