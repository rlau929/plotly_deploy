function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  buildBubble(newSample);
}

function buildMetadata(sample) {
d3.json("samples.json").then((data) => {
  var metadata = data.metadata;
  var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = resultArray[0];
  var PANEL = d3.select("#sample-metadata");
  
  PANEL.html("");

  var strid = "id: ";
  var resid = strid.concat(result.id);
  PANEL.append("h6").text(resid);

  var streth = "ethnicity: ";
  var reseth = streth.concat(result.ethnicity);
  PANEL.append("h6").text(reseth);

  var strgender = "gender: ";
  var resgender = strgender.concat(result.gender);
  PANEL.append("h6").text(resgender);

  var strage = "age: ";
  var resage = strage.concat(result.age);
  PANEL.append("h6").text(resage);

  var strlocation = "location: ";
  var reslocation = strlocation.concat(result.location);
  PANEL.append("h6").text(reslocation);

  var strbbtype = "bbtype: ";
  var resbbtype = strbbtype.concat(result.bbtype);
  PANEL.append("h6").text(resbbtype);

  var strwfreq = "wfreq: ";
  var reswfreq = strwfreq.concat(result.wfreq);
  PANEL.append("h6").text(reswfreq);
  
  // Loading gauge chart
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: result.wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>" },
      type: "indicator",
      mode: "gauge+number",
      rotation: 90,
      gauge: {
        axis: { range: [0, 9] },
        bar: { color: "red" },
        steps: [
          { range: [0, 1], color: "rgba(232, 226, 202, .5)" },
          { range: [1, 2], color: "rgba(210, 206, 145, .5)" },
          { range: [2, 3], color: "rgba(190, 190, 120, .5)" },
          { range: [3, 4], color: "rgba(180, 190, 120, 1)" },
          { range: [4, 5], color: "rgba(150, 206, 60, 1)" },
          { range: [5, 6], color: "rgba(120, 190, 50, 1)" },
          { range: [6, 7], color: "rgba(80, 160, 42, 1)"  },
          { range: [7, 8], color: "rgba(40, 147, 22, 1)" },
          { range: [8, 9], color: "rgba(14, 127, 0, 1)" },
          { range: [""], color: "rgba(255, 255, 255, 0)" },
        ],
        textinfo: "text",
        textposition: "inside",
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 9
        },

    }
  }
  ];
  
  var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
  Plotly.newPlot('gauge', data, layout);

});

};

// Loading bar chart
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampledata = data.samples;
    var resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);
    var x = resultArray[0]["sample_values"];
    var y = resultArray[0]["otu_ids"].slice(0,10);
    var text = resultArray[0]["otu_labels"].slice(0,10);

    var trace1 = {
      x: x.slice(0,10).reverse(),
      y: y.map(id => 'OTU: ' + id),
      text: text,
      type: "bar",
      orientation: "h",
    };
    var data2 = [trace1];

    Plotly.newPlot('bar', data2);
    
  });
};
// Loading bubble chart
function buildBubble(sample) {
  d3.json("samples.json").then((data) => {
    var sampledata = data.samples;
    var resultArray = sampledata.filter(sampleObj => sampleObj.id == sample);

    var bubble = {
      x: resultArray[0]["otu_ids"],
      y: resultArray[0]["sample_values"],
      text: resultArray[0]["otu_labels"],
      mode: 'markers',
      marker: {
        size: resultArray[0]["sample_values"],
        color: resultArray[0]["otu_ids"],
        colorscale: 'Earth',
        }
    };
    var data3 = [bubble];
    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"},
      hovermode: "closests",
      showlegend: false,
      autosize: true,
      height: 500,
      width: 900,
    };
    Plotly.newPlot('bubble', data3, layout);
  });
};


init();