import React from 'react';

interface BarChartProps {
  data: { name: string; value: number; fill: string; unit:string }[];
  width?: number;
  height?: number;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 300,
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div style={{ padding:"0px", display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column"}}>
      <div style={{ position: "relative", width: "400px", display:"flex", justifyContent:"center", alignItems:"center" }}>
        <svg width={width} height={height + 60}>
          {data.map((item, index) => {
            const barWidth = width / data.length - 5;
            const barHeight = (item.value / maxValue) * height;
            const x = index * (width / data.length);
            const y = height - barHeight;

            return (
              <g key={index} >
                <rect
                  x={x}
                  y={y + 50}
                  width={barWidth}
                  height={barHeight}
                  fill={item.fill}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 10 + 50} 
                  fill="black"
                  textAnchor="middle"
                  fontSize="100%"
                >
                  {`${item.value} ${item.unit} `}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "0px", marginLeft:"0%", width:"100%"}}>
        {data.map((item, index) => (
          <div key={index} style={{display:"flex", padding:"2%", margin:"auto"}}>
            <div style={{ width: "10px", height: "10px", marginRight: "5px", backgroundColor: item.fill, marginTop:"11px" }}></div>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
