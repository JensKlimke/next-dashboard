import moment from "moment";

export const merge = (target : any, source : any) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  const s = {... source};
  const t = {... target};
  for (const key of Object.keys(s)) {
    if (s[key] instanceof Object)
      Object.assign(s[key], merge(t[key], s[key]))
  }
  Object.assign(t || {}, s)
  return t
}

export const options = {
  chart: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    foreColor: '#3F3F3F'
  },
  dataLabels: {
    enabled: false
  },
  grid: {
    padding: {
      left: 25,
      right: 25,
    },
  },
  xaxis: {
    labels: {
      style: {
        fontSize: '12pt'
      }
    },
    title: {
      text: 'Time',
      style: {
        fontSize: '12pt'
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12pt'
      }
    },
    title: {
      style: {
        fontSize: '12pt'
      },
    },
  },
  legend: {
    fontSize: '16px',
    fontFamily: 'Roboto',
    fontWeight: 400,
    position: 'top',
  }
};


export const timeLineChartOptions = merge(options, {
  chart: {
    toolbar: {
      show: false
    },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  colors: ["#1C55A1", "#CC071E", "#3F3F3F", "#2D9373", "#F2A800", "#4B80B9", "#6DD2B2", "#656567"],
  xaxis: {
    type: 'datetime',
    title: {
      text: 'Time',
    },
    labels: {
      formatter: (value : any) => moment(value).format('YYYY-MM-DD')
    }
  },
  yaxis: {
    title: {
      text: 'Value'
    },
    labels: {
      formatter: (value : any) => Intl.NumberFormat('en-US').format(value)
    }
  }
});

