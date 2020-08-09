// Creates a dropdown menu of ID numbers dynamically
function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })
  optionChanged("940"); //Defaults the pages to load with ID: 940 data

}
  

// Take action when an item is selected. Called in the html
function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var PANEL = d3.select("#sample-metadata");
    var PANEL_body = d3.select(".panel-body");

    PANEL.html("");
    Object.entries(resultArray[0]).forEach(([key, value]) =>{
        PANEL_body.append("h6").text(`${key} : ${value}`)
    });
  });
}


function buildCharts(sample){
  //sample is the id selected from the drop down (i.e. 941)
  d3.json("samples.json").then((dataSet) => {
  
    console.log(dataSet);

    //Get OTU info
    //console.log(dataSet.samples);

    //get the sample data alone
    var sampleInfo = dataSet.samples;
    console.log(sampleInfo);

    //Get the data for the sample id
    var resultsArray = sampleInfo.filter(sampleObj => sampleObj.id == sample);
    console.log(resultsArray);

    //get the 10 otu_ids with the higest values
    //The array is already sorted (determined after viewing the data)
    //Slice the array to just include the 1st 10 objects
    top10_otu_ids = resultsArray[0].otu_ids.slice(0,10);
    top10_otu_values = resultsArray[0].sample_values.slice(0,10);
    top10_otu_labels = resultsArray[0].otu_labels.slice(0,10);

    //The ids will be treated as numbers in the chart. Convert them to strings
    let top10_otu_ids_strings = top10_otu_ids.map(xLabel => {
      return `OTU ${xLabel}`
    })

    console.log(top10_otu_ids);
    console.log(top10_otu_values);
    console.log(top10_otu_labels);
    

    //BAR (div id="barPlotArea")
    var barTrace = {
      x: top10_otu_values,
      y: top10_otu_ids_strings,
      text: top10_otu_labels,
      orientation: 'h',
      type: "bar"
    };
    var barData = [barTrace];
    var barLayout = {
      title: `Top 10 OTUs for ID: ${sample}`,
      yaxis:{autorange:'reversed'},
    };
    Plotly.newPlot("barPlotArea", barData, barLayout);


    //BUBBLE (div id="bubblePlotArea")
    var bubbleTrace ={
      x: resultsArray[0].otu_ids,
      y: resultsArray[0].sample_values,

      mode: 'markers',
      marker: {
        size: resultsArray[0].sample_values,
        color: resultsArray[0].otu_ids,
        text: resultsArray[0].otu_labels
      }
    };
    var bubbleData = [bubbleTrace];

    var bubbleLayout={
      showlegend: false,
      title: `ID: ${sample} OTU counts`,
      height: 600,
      width: 1200
    };

    Plotly.newPlot("bubblePlotArea", bubbleData, bubbleLayout);


    //GAUGE div id="gaugePlotArea"
    var metadata = dataSet.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: resultArray[0].wfreq,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number+delta",
        gauge: {
          axis: { range: [null, 9] },
          steps: [
            { range: [0, 1], color: "#f8f3ec", name: "0-1"},
            { range: [1, 2], color: "#f4f1e5"},
            { range: [2, 3], color: "#e9e6ca"},
            { range: [3, 4], color: "	#e5e7b3"},
            { range: [4, 5], color: "#d5e49d"},
            { range: [5, 6], color: "#b7cc92"},
            { range: [6, 7], color: "	#8cbf88"},
            { range: [7, 8], color: "#8abb8f"},
            { range: [8, 9], color: "#85b48a"}
          ],

        }
      }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gaugePlotArea', gaugeData, layout);


  });//End d3

}//End buildCharts


init();