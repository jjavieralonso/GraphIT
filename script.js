"use strict"

document.addEventListener('DOMContentLoaded', function () {
    var chartForm = document.getElementById('chartForm');
    var addSerieBtn = document.getElementById('addSerieBtn');
    var deleteSerieBtn = document.getElementById('deleteSerieBtn');
    var serieContainerCount = 2;
    var addDataBtns = {};
    var deleteDataBtns = {};
    updateBtnsToSeries();

    function updateBtnsToSeries() { //le da a los botones su funcionalidad
        for (let i = 1; i < serieContainerCount; i++) {
            addDataBtns[i] = document.getElementById("addDataBtnSerie" + i);
            addDataBtns[i].addEventListener("click", function () {
                agregarInputsDatos(i);
            });

            deleteDataBtns[i] = document.getElementById("deleteDataBtnSerie" + i);
            deleteDataBtns[i].addEventListener("click", function () {
                borrarUltimoDato(i);
            });
        }
    }

    function countOfDatosInSerie(numSerie) { //cuenta la cantidad de datos que hay dentro de la serie que se le pase
        var serieDataInputs = document.getElementById("Serie" + numSerie + "DataInputs");
        var elementos = serieDataInputs.querySelectorAll(".dataInput");
        return elementos.length;
    }

    function borrarUltimoDato(numSerie) { //borra el ultimo dato de la serie que se le pase
        const serieContainer = document.getElementById('Serie' + numSerie + 'DataInputs');
        if (serieContainer) {
            const divs = serieContainer.querySelectorAll('div');
            const lastDiv = divs[divs.length - 1];
            if (lastDiv) {
                serieContainer.removeChild(lastDiv);
            }
        }
    }

    function agregarInputsDatos(numSerie) { // agrega otro input para poder ingresar otro dato que se quiera.
        var newInputContainer = document.createElement('div');
        newInputContainer.classList.add('dataInput');

        var colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.classList.add('color-input-style');
        var idValue = 'color-input-' + numSerie + "-" + (countOfDatosInSerie(numSerie) + 1);
        colorInput.setAttribute('id', idValue);
        colorInput.placeholder = 'Color';

        var nombreDato = document.createElement('input');
        nombreDato.type = 'text';
        nombreDato.placeholder = 'Título del dato';

        var valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.placeholder = 'Valor';

        var serieToPutNewData = document.getElementById('Serie' + numSerie + 'DataInputs');

        newInputContainer.appendChild(colorInput);
        newInputContainer.appendChild(nombreDato);
        newInputContainer.appendChild(valueInput);
        serieToPutNewData.appendChild(newInputContainer);

        return newInputContainer;
    };

    addSerieBtn.addEventListener('click', function () {
        var serieActual = serieContainerCount;
        var newSerieContainer = document.createElement('div');
        var idValue1 = 'serie' + serieContainerCount;
        newSerieContainer.setAttribute('id', idValue1);

        var newLabelSerie = document.createElement('label');
        newLabelSerie.textContent = 'Serie de Datos ' + serieContainerCount + ':';

        var newBtnAddData = document.createElement('button');
        var idValue2 = 'addDataBtnSerie' + serieContainerCount;
        newBtnAddData.type = 'button'
        newBtnAddData.addEventListener('click', function () {
            agregarInputsDatos(serieActual);
        })
        newBtnAddData.textContent = 'Agregar dato';
        newBtnAddData.setAttribute('id', idValue2);

        var newBtnDeleteData = document.createElement('button');
        var idValue3 = 'deleteDataBtnSerie' + serieContainerCount;
        newBtnDeleteData.type = 'button'
        newBtnDeleteData.addEventListener('click', function () {
            borrarUltimoDato(serieActual);
        })
        newBtnDeleteData.textContent = 'Borrar ultimo dato';
        newBtnDeleteData.setAttribute('id', idValue3);

        var newDivDataForm = document.createElement('div');
        var idValue4 = 'Serie' + serieContainerCount + 'DataInputs';
        newDivDataForm.setAttribute('id', idValue4);

        newSerieContainer.appendChild(newLabelSerie);
        newSerieContainer.appendChild(newBtnAddData);
        newSerieContainer.appendChild(newBtnDeleteData);
        newSerieContainer.appendChild(newDivDataForm);
        chartForm.appendChild(newSerieContainer);
        serieContainerCount++;
        var i = serieContainerCount - 1;
        newDivDataForm.appendChild(agregarInputsDatos(i));
    });

    deleteSerieBtn.addEventListener('click', function () { // borra la ultima serie de datos generada.
        chartForm.removeChild(chartForm.lastChild);
        if (serieContainerCount > 1) { serieContainerCount--; }
    });

    chartForm.addEventListener('submit', function (event) { // consulta los valores de cada dato y los pasa a Highcharts para generar el grafico.
        event.preventDefault();
        var graphName = document.getElementById('graphName').value;
        var chartType = document.getElementById('chartType').value;

        var chartOptions = {
            chart: {
                renderTo: 'chartContainer',
                type: chartType
            },
            title: {
                text: graphName
            },
            series: [],
            xAxis: {
                categories: []
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

        for (var i = 1; i < serieContainerCount; i++) {
            var serieDataInputs = document.getElementById("Serie" + i + "DataInputs");
            var dataInputs = serieDataInputs.querySelectorAll(".dataInput");
            var dataColors = [];
            var dataLabels = [];
            var dataValues = [];

            for (var j = 0; j < dataInputs.length; j++) {
                var colorDato = dataInputs[j].querySelector('input[type="color"]');
                var nombreDato = dataInputs[j].querySelector('input[type="text"]');
                var valueInput = dataInputs[j].querySelector('input[type="number"]');

                dataColors.push(colorDato.value);
                dataLabels.push(nombreDato.value);
                dataValues.push(Number(valueInput.value));
            }

            chartOptions.series.push({
                name: 'Serie ' + i,
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
            });
        }

        var chart = new Highcharts.Chart(chartOptions);
    });
});