document.addEventListener('DOMContentLoaded', function () {
    var chartForm = document.getElementById('chartForm');
    var addDataBtn = document.getElementById('addDataBtn');
    var deleteDataBtn = document.getElementById('deleteDataBtn');
    var dataInputsContainer = document.getElementById('dataInputs');
    var dataInputsCount = 1;

    addDataBtn.addEventListener('click', function () { // agrega otro input para poder ingresar otro dato que se quiera.
        var newInputContainer = document.createElement('div');
        newInputContainer.classList.add('dataInput');

        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.classList.add('color-input-style');
        colorInput.setAttribute('color-input', dataInputsCount);

        var nombreDato = document.createElement('input');
        nombreDato.type = 'text';
        nombreDato.placeholder = 'Título del dato';

        var valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.placeholder = 'Valor';


        newInputContainer.appendChild(colorInput);
        newInputContainer.appendChild(nombreDato);
        newInputContainer.appendChild(valueInput);

        dataInputsContainer.appendChild(newInputContainer);

        dataInputsCount++;
    });

    deleteDataBtn.addEventListener('click', function () { // borra el ultimo dato generado
        var dataInputs = document.getElementsByClassName('dataInput');
        if (dataInputs.length > 1) {
            dataInputs[dataInputs.length - 1].remove();
        }
    });

    chartForm.addEventListener('submit', function (event) { // consulta los valores de cada dato y los pasa a Highcharts para generar el grafico.
        event.preventDefault();
        var graphName = document.getElementById('graphName').value;
        var chartType = document.getElementById('chartType').value;

        var dataInputs = document.getElementsByClassName('dataInput');
        var dataColors = [];
        var dataLabels = [];
        var dataValues = [];

        for (var i = 0; i < dataInputs.length; i++) {
            var colorDato = dataInputs[i].querySelector('input[type="color"]');
            var nombreDato = dataInputs[i].querySelector('input[type="text"]');
            var valueInput = dataInputs[i].querySelector('input[type="number"]');

            dataColors.push(colorDato.value);
            dataLabels.push(nombreDato.value);
            dataValues.push(Number(valueInput.value));
        }

        var chartOptions = {
            chart: {
                renderTo: 'chartContainer',
                type: chartType
            },
            title: {
                text: graphName
            },
            series: [{
                name: 'Datos',
                data: dataValues.map(function (value, index) {
                    return {
                        y: value,
                        name: dataLabels[index],
                        color: dataColors[index]
                    };
                }),
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}'
                }
            }],
            xAxis: {
                categories: dataLabels
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                        fillColor: null,
                        lineWidth: 2,
                        lineColor: null,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            lang: { //proporcionado por Highcharts.
                contextButtonTitle: 'Exportar gráfico',
                downloadJPEG: 'Descargar en JPEG',
                downloadPDF: 'Descargar en PDF',
                downloadPNG: 'Descargar en PNG',
                downloadSVG: 'Descargar en SVG',
            },
            exporting: {
                buttons: {
                    contextButton: {
                        menuItems: [
                            'downloadPNG',
                            'downloadJPEG',
                            'downloadPDF',
                            'downloadSVG',
                        ]
                    }
                }
            }
        };
        var chart = new Highcharts.Chart(chartOptions);
    });
});
