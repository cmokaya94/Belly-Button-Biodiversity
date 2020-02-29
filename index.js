function buildchart (){
    d3.json("samples.json").then((data)=>{
        var metadata = data.metadata
        var samples = data.samples;

        metadata.forEach((x) => {
            var data = d3.select("#selDataset").append("option");
            data.text(`${x.id}`).attr("value",`${x.id}`);
        }) 

        d3.select("#id").text(`ID: ${metadata[0].id}`);
        d3.select("#ethnicity").text(`Ethnicity: ${metadata[0].ethnicity}`);
        d3.select("#gender").text(`Gender: ${metadata[0].gender}`);
        d3.select("#age").text(`Age: ${metadata[0].age}`);
        d3.select("#location").text(`Location: ${metadata[0].location}`);
        d3.select("#bb").text(`BBtype: ${metadata[0].bbtype}`);
        d3.select("#freq").text(`Wfreq: ${metadata[0].wfreq}`);
        // Horizontal Bar Plot
        data = samples[0].sample_values.slice(0,10)
        final_data = data.reverse();
        y_data = samples[0].otu_ids.slice(0,10)
        final_y_data = y_data.reverse();

        var trace1 = {
            x:final_data,
            y :final_y_data.map(x => `OTU ${x}`),
            type:"bar",
            orientation:"h",
            name: "Belly Button",
            text:samples[0].otu_labels.slice(0,10)
        };
        var data = [trace1]

        var layout = {
            xaxis: {title:"Values"},
            yaxis:{title:"Otu Names"}
        };

        Plotly.newPlot("bar",data,layout)

        //BUBBLE PLOT
        var trace3 = {
            x: samples[0].otu_ids,
            y: samples[0].sample_values,
            mode: "markers",
            marker: {
                size:samples[0].sample_values,
                color: samples[0].otu_ids
            },
            name: "Belly Button Samples",
            text: samples[0].otu_labels
        };
        
        // Create the data array for the plot
        var data = [trace3];
        
        // Define the plot layout
        var layout = {
            xaxis: { title: "OTU ID" },
        };
        
        // Plot the chart to a div tag with id "plot"
        Plotly.newPlot("bubble", data, layout);

    }
    )
}

buildchart();


var option = d3.select("#selDataset");
option.on("change", updateset);

function updateset() {

    d3.json("samples.json").then((data) => {
  
        var metadata = data.metadata;
        var samples = data.samples;

        var dropdownValue = d3.select("#selDataset");
        var newvalue = dropdownValue.node().value;

        //DEMOGRAPHIC UPDATE
        metadata.forEach((obj) => {
            if (obj.id == newvalue) {
                d3.select("#id").text(`ID: ${obj.id}`);
                d3.select("#ethnicity").text(`Ethnicity: ${obj.ethnicity}`);
                d3.select("#gender").text(`Gender: ${obj.gender}`);
                d3.select("#age").text(`Age: ${obj.age}`);
                d3.select("#location").text(`Location: ${obj.location}`);
                d3.select("#bb").text(`BBtype: ${obj.bbtype}`);
                d3.select("#freq").text(`Wfreq: ${obj.wfreq}`);
            };
        });

        //FIRST PLOT (BAR) UPDATE
        var x=[];
        var y=[];
        samples.forEach((obj) => {
            if (obj.id == newvalue) {
                x = obj.sample_values.slice(0,10).reverse();
                y = obj.otu_ids.slice(0,10).reverse().map(val => `OTU ${val}`);
                
            }
        })
        Plotly.restyle("bar","x", [x]);
        Plotly.restyle("bar","y", [y]);


        //THIRD PLOT (BUBBLE) UPDATE
        var x=[];
        var y=[];
        var markersize = [];
        var markercolor = [];
        var text = [];

        samples.forEach((obj) => {
            if (obj.id == newvalue) {
                x = obj.otu_ids;
                y = obj.sample_values;
                markersize = obj.sample_values;
                markercolor = obj.otu_ids;
                text = obj.otu_labels;
            }
        })
        Plotly.restyle("bubble","x", [x]);
        Plotly.restyle("bubble","y", [y]);
        Plotly.restyle("bubble","size", [markersize]);
        Plotly.restyle("bubble","color", [markercolor]);
        Plotly.restyle("bubble","text", [text]);

    });
};
