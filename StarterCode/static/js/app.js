// Get the Sample endpoint
//var data_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

console.log("----Data Preview----")
//Preview the data
d3.json("samples.json").then((data) => {console.log(data);
});

// Listing dropdown button
let listing = d3.json("samples.json").then(listing => {
    // const samples = listing.samples;
    // const metadata = listing.metadata;
    const names = listing.names;

    console.log("---Dropdown Listing Test---")
    console.log(names)

    // Listing subjectID
    let dropdown = d3.select('#selDataset')
    names.forEach(name => {
        dropdown.append('option').text(name).property('value',name);  
    });
    
    // Initial value
    demoInfo("940");
    charting("940")
})

// Demographic Info panel
function demoInfo(subjectID) {
    let demoInfo = d3.json("samples.json").then(demoInfo => {
        const metadata = demoInfo.metadata;
        let infoPanel = d3.select('#sample-metadata')
        infoPanel.html('');
        let filterInfo = metadata.filter(sampleID => sampleID.id == subjectID)[0]
        
        console.log("---filterInfo Test---")
        console.log(filterInfo)

        Object.entries(filterInfo).forEach(([key, value]) => {
            infoPanel.append("h6").text(`${key}:${value}`);
        });
    });
}

function optionChanged(selection) {
    demoInfo(selection)
    charting(selection)
}

// Build charts
function charting(sampleData) {
    let data = d3.json("samples.json").then(data => {

        // Retrieve sample values
        const chartData = data.samples;
        let filterSample = chartData.filter(sampleID => sampleID.id == sampleData)[0]
        let otuIDs = filterSample.otu_ids
        let otuLabels = filterSample.otu_labels
        let sampleValues = filterSample.sample_values
        
        const meta = data.metadata;
        let filterMeta = meta.filter(sampleID => sampleID.id == sampleData) [0]
        let wFreq = filterMeta.wfreq

        console.log("----Chart Data Test----")
        console.log(otuIDs)
        console.log(otuLabels)
        console.log(sampleValues)
        console.log(wFreq)

        function unpack(rows,index) {
            return rows.map(function (row) {
                return row[index];
            });
        }

        // Bar chart
        function barChart(id) {
            let yValue = otuIDs.slice(0,10).map(id => `OTU ${id}`).reverse()
            
            console.log("---Reversed Sliced ID Test---")
            console.log(yValue)
            
            var traceBar = {
                y: yValue,
                x: sampleValues.slice(0,10).reverse(),
                text: otuLabels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
            };

            var barData = [traceBar];

            let layoutBar = {
                title: "Top Ten OTU ID"
            };
            Plotly.newPlot("bar",barData,layoutBar);
        }
        
        // Bubble chart
        function bubbleChart(id) {
            let xValue = otuIDs.map(id => id)

            var traceBubble = {
                y: sampleValues,
                x: xValue,
                text: otuLabels,
                mode: 'markers',
                marker: {
                    size: sampleValues,
                    sizeref: 0.1,
                    sizemode:"area",
                    color: sampleValues,
                    opacity: sampleValues,
                    colorscale: 'Picnic'
                }
            };

            var bubbleData = [traceBubble];

            let layoutBubble = {
                xaxis: {
                    title: "OTU"
                }
            };
            Plotly.newPlot("bubble",bubbleData,layoutBubble,{scrollZoom: true});
        }

        //Gauge chart
        function gaugeChart(id) {
            var traceGauge = {
                domain: {x:[0,1], y:[0,1]},
                value: wFreq,
                title: { text: "Belly Button Washing Frequency"},
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0,9], tickwidth: 1, tickcolor: "black"},
                    bar: {color: "red"},
                    steps: [
                        {range:[0,4],color: "lightgray"},
                        {range:[4,7],color:"lightgreen"},
                        {range:[7,9],color:"green"}
                    ],
                    treshold: {
                        line: {color:"black",width: 3},
                        thickness: 1,
                        value: 9
                    }
                },
                bgcolor: "grey", 
            }

            var gaugeData = [traceGauge];

            Plotly.newPlot("gauge", gaugeData);     
        }

        barChart(sampleData)
        bubbleChart(sampleData)
        gaugeChart(sampleData)

    })
}