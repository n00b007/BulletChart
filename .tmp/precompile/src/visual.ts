/*
 *  Bullet Chart by OKViz
 *  v2.1.0
 *
 *  Copyright (c) SQLBI. OKViz is a trademark of SQLBI Corp.
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual.PBI_CV_9272D058_BEA0_476A_B090_A712545F92FA  {

    interface VisualViewModel {
        dataPoints: VisualDataPoint[];
        legendDataPoints: VisualLegendDataPoint[];
        domain: VisualDomain;
        settings: VisualSettings;
        hasHighlights: boolean;
        hasCategories: boolean;
    }

    interface VisualDataPoint {
        displayName?: string;
        value?: number;
        highlightValue?: number;
        comparisonValue?:number;
        color?: string;
        comparisonColor?: string;
        targets?: VisualTarget[];
        states?: VisualState[];
        format?: string;
        selectionId?: any;
        tooltips?: VisualTooltipDataItem[];
    }

    interface VisualLegendDataPoint {
        displayName: string;    
        showOnDemand: boolean; 
        color?: string;
        selectionId: any;
    }

    interface VisualState {
        value: number;
        color?: string;
        displayName?: string;
        format?: string;
        selectionId: any;
    }

    interface VisualTarget {
        value: number;
        marker: string;
        color?: string;
        displayName?: string;
        selectionId: any;
    }

    interface VisualDomain {
        start?: number;
        end?: number;
        startForced: boolean;
        endForced: boolean;
    }

    interface VisualSettings {
        general: {
            orientation: string;
            minHeight?: number;
            maxHeight?: number;
        },
        dataPoint: {
            defaultFill: Fill;
            showAll: boolean;
        };
        label: {
            show: boolean;
            text?: string;
            fontSize: number;
            fill: Fill;
            autoSize: boolean;
        };
        dataLabels : {
            show: boolean;
            fontSize: number;
            fill: Fill;
            unit?: number; 
            precision?: number; 
        };
        
        targets: {
            markerFill: Fill;
            comparison: string;
        };
        states: {
            show: boolean;
            calculate: string;
            state1?: number;
            state1Fill?: Fill;
            state2?: number;
            state2Fill?: Fill;
            state3?: number;
            state3Fill?: Fill;
            state4?: number;
            state4Fill?: Fill;
            state5?: number;
            state5Fill?: Fill;
        };
        axis : {
            show: boolean;
            start?: number,
            end?: number,
            fill: Fill;
            unit?: number;
            precision?: number; 
        };

        colorBlind?: {
            vision?: string;
        }
    }

    function defaultSettings(): VisualSettings {

        return {
            general: {
                orientation: "h"
            },
            dataPoint: {
                defaultFill: { solid: { color: "#00b8aa" } },
                showAll: false
            },
            label: {
               show: true,
               text: '',
               fontSize: 9, 
               fill: {solid: { color: "#777" } },
               autoSize: true
           },
           dataLabels: {
               show: false,
               fill: {solid: { color: "#777" } },
               fontSize: 9,
               unit: 0
           },
           targets: {
               markerFill: {solid: { color: "#333" } },
               comparison: '<'
           },
           states : {
               show: true,
               calculate: 'percentage',
               state5Fill: { solid: { color: "#f2f2f2" } },
               state4Fill: { solid: { color: "#eee" } },
               state3Fill: { solid: { color: "#ddd" } },
               state2Fill: { solid: { color: "#ccc" } },
               state1Fill: { solid: { color: "#bbb" } }
           },
            axis: {
               show: true,
               fill: {solid: { color: "#777" } },
               unit: 0
            },

            colorBlind: {
                vision: "Normal"
            }
        };
    }

    function visualTransform(options: VisualUpdateOptions, host: IVisualHost): VisualViewModel {

        //Get DataViews
        var dataViews = options.dataViews;
        var hasDataViews = (dataViews && dataViews[0]);
        var hasCategoricalData = (hasDataViews && dataViews[0].categorical && dataViews[0].categorical.values);
        var hasSettings = (hasDataViews && dataViews[0].metadata && dataViews[0].metadata.objects);
        var hasHighlights = false;

        //Get Settings
        var settings: VisualSettings = defaultSettings();
        if (hasSettings) {
            var objects = dataViews[0].metadata.objects;
            settings = {
                 general: {
                    orientation: getValue<string>(objects, "general", "orientation", settings.general.orientation),
                    minHeight: getValue<number>(objects, "general", "minHeight", settings.general.minHeight),
                    maxHeight: getValue<number>(objects, "general", "maxHeight", settings.general.maxHeight)
                },
                dataPoint: {
                    defaultFill: getValue<Fill>(objects, "dataPoint", "defaultFill", settings.dataPoint.defaultFill),
                    showAll: getValue<boolean>(objects, "dataPoint", "showAll", settings.dataPoint.showAll)
                },
                label: {
                    show: getValue<boolean>(objects, "label", "show", settings.label.show),
                    text: getValue<string>(objects, "label", "text", settings.label.text),
                    fontSize: getValue<number>(objects, "label", "fontSize", settings.label.fontSize),
                    fill: getValue<Fill>(objects, "label", "fill", settings.label.fill),
                    autoSize: getValue<boolean>(objects, "label", "autoSize", settings.label.autoSize)
                },
                dataLabels: {
                    show: getValue<boolean>(objects, "dataLabels", "show", settings.dataLabels.show),
                    fontSize: getValue<number>(objects, "dataLabels", "fontSize", settings.dataLabels.fontSize),
                    fill: getValue<Fill>(objects, "dataLabels", "fill", settings.dataLabels.fill),
                    unit: getValue<number>(objects, "dataLabels", "unit", settings.dataLabels.unit),
                    precision: getValue<number>(objects, "dataLabels", "precision", settings.dataLabels.precision)
                },
               
                targets: {
                    markerFill: getValue<Fill>(objects, "targets", "markerFill", settings.targets.markerFill),
                    comparison: getValue<string>(objects, "targets", "comparison", settings.targets.comparison)
                },
                states: {
                    show: getValue<boolean>(objects, "states", "show", settings.states.show),
                    calculate: getValue<string>(objects, "states", "calculate", settings.states.calculate),
                    state1: getValue<number>(objects, "states", "state1", settings.states.state1),
                    state1Fill: getValue<Fill>(objects, "states", "state1Fill", settings.states.state1Fill),
                    state2: getValue<number>(objects, "states", "state2", settings.states.state2),
                    state2Fill: getValue<Fill>(objects, "states", "state2Fill", settings.states.state2Fill),
                    state3: getValue<number>(objects, "states", "state3", settings.states.state3),
                    state3Fill: getValue<Fill>(objects, "states", "state3Fill", settings.states.state3Fill),
                    state4: getValue<number>(objects, "states", "state4", settings.states.state4),
                    state4Fill: getValue<Fill>(objects, "states", "state4Fill", settings.states.state4Fill),
                    state5: getValue<number>(objects, "states", "state5", settings.states.state5),
                    state5Fill: getValue<Fill>(objects, "states", "state5Fill", settings.states.state5Fill)
                },
                axis: {
                    show: getValue<boolean>(objects, "axis", "show", settings.axis.show),
                    start: getValue<number>(objects, "axis", "start", settings.axis.start),
                    end: getValue<number>(objects, "axis", "end", settings.axis.end),
                    fill: getValue<Fill>(objects, "axis", "fill", settings.axis.fill),
                    unit: getValue<number>(objects, "axis", "unit", settings.axis.unit),
                    precision: getValue<number>(objects, "axis", "precision", settings.axis.precision)
                },

                colorBlind: {
                     vision: getValue<string>(objects, "colorBlind", "vision", settings.colorBlind.vision),
                }
            }

            //Limit some properties
            if (settings.general.minHeight < 0) settings.general.minHeight = 0;
            if (settings.general.maxHeight < 0) settings.general.maxHeight = 0;
            if (settings.dataLabels.precision < 0) settings.dataLabels.precision = 0;
            if (settings.dataLabels.precision > 5) settings.dataLabels.precision = 5;
            if (settings.axis.precision < 0) settings.axis.precision = 0;
            if (settings.axis.precision > 5) settings.axis.precision = 5;
        }
        
        //Get DataPoints
        let domain: VisualDomain = { start:0, startForced: false, end:0, endForced: false };
        if (settings.axis.start !== undefined) {
            domain.start = settings.axis.start;
            domain.startForced = true;
        }
        if (settings.axis.end !== undefined) {
            domain.end = settings.axis.end;
            domain.endForced = true;
        }

        let dataPoints: VisualDataPoint[] = [];
        let legendDataPoints: VisualLegendDataPoint[] = [];
        let hasCategories = false;

        if (hasCategoricalData) {
            let dataCategorical = dataViews[0].categorical;
            let category = (dataCategorical.categories ? dataCategorical.categories[0] : null);
            let categories = (category ? category.values : ['']);

            //Get DataPoints
            for (let i = 0; i < categories.length; i++) {

                let showOnDemand = false;
                let dataPoint: VisualDataPoint = {
                    states: [],
                    targets: [],
                    tooltips: []
                };

                for (let ii = 0; ii < dataCategorical.values.length; ii++) {

                    let dataValue = dataCategorical.values[ii];
                    let addRegularTooltip = false;
                    let checkDomain = false;
                    let value: any = dataValue.values[i];
                    let color: any;

                    if (dataValue.source.roles['Value']){ //value -> Value for legacy compatibility
                        if (value !== null) {

                            dataPoint.value = value;

                            if (dataValue.highlights) {
                                dataPoint.highlightValue = <any>dataValue.highlights[i];
                                hasHighlights = true;
                            }

                            dataPoint.format = dataValue.source.format;

                            let displayName;
                            let identity;

                            if (category) {

                                identity = host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();

                                displayName = OKVizUtility.makeMeasureReadable(categories[i]);
                                
                                if (settings.dataPoint.showAll) {
                                    let defaultColor: Fill = { solid: { color: host.colorPalette.getColor(displayName).value } };

                                    color = getCategoricalObjectValue<Fill>(category, i, 'dataPoint', 'fill', defaultColor).solid.color;
                                } else {
                                    color = settings.dataPoint.defaultFill.solid.color;
                                }
                                hasCategories = true;
                                showOnDemand = true;

                                dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                    displayName: (category.source.displayName || "Category"),
                                    color: '#333',
                                    value: displayName
                                });

                            } else {

                                identity = host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId();

                                displayName = dataValue.source.displayName;

                                let defaultColor: Fill = { solid: { color: host.colorPalette.getColor(displayName).value } };

                                color = getValue<Fill>(dataValue.source.objects, 'dataPoint', 'fill', defaultColor).solid.color;

                            }

                            dataPoint.displayName = String(displayName);
                            dataPoint.color = color;
                            dataPoint.selectionId = identity;

                            legendDataPoints.push({
                                displayName: String(displayName),
                                color: color,
                                showOnDemand: showOnDemand,
                                selectionId: identity
                            });

                            addRegularTooltip = true;
                            checkDomain = true;
                        }
                    }

                    if (dataValue.source.roles['ComparisonValue']) { //comparison -> ComparisonValue for legacy compatibility
                        if (value !== null) {
                            dataPoint.comparisonValue = value;
                            let displayName = dataValue.source.displayName;

                            let defaultColor: Fill = { solid: { color: '#99E3DD' } };
                            color = getValue<Fill>(dataValue.source.objects, 'dataPoint', 'fill', defaultColor).solid.color;

                            dataPoint.comparisonColor = color;

                            if (legendDataPoints.map(x => x.displayName).indexOf(displayName) === -1) {

                                let identity = host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId();

                                legendDataPoints.push({
                                    displayName: String(displayName),
                                    showOnDemand: false,
                                    color: color,
                                    selectionId: identity
                                });
                            }
                            addRegularTooltip = true;
                            checkDomain = true;
                        }
                    }

                     if (dataValue.source.roles['targets']) {
                        if (value !== null) {
                            
                            let availableMarkers = ['line', 'cross', 'circle'];
                            let idx = dataPoint.targets.length; 
                            if (idx >= availableMarkers.length) idx = 0;

                            let targetColor:any = getValue<Fill>(dataValue.source.objects, 'targets', 'fill', null);
                            if (targetColor) targetColor = targetColor.solid.color;

                            dataPoint.targets.push({
                                 value: value,
                                 marker: getValue<string>(dataValue.source.objects, 'targets', 'marker', availableMarkers[idx]),
                                 color: targetColor,
                                 displayName: dataValue.source.displayName,
                                 selectionId: host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId()
                             }); 

                            addRegularTooltip = true;
                            checkDomain = true;
                        }
                     }

                     if (dataValue.source.roles['states']) {
                        if (value !== null) {

                            let idx = dataPoint.states.length; 
                            if (idx >= 5) idx = 0;

                            let stateColor = getValue<Fill>(dataValue.source.objects, 'states', 'fill', settings.states["state" + (idx + 1) + "Fill"]).solid.color;

                             dataPoint.states.push({
                                 value: value,
                                 color: stateColor,
                                 displayName: dataValue.source.displayName,
                                 format: dataValue.source.format,
                                 selectionId: host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId()
                             });
                        }
                     }


                    if (checkDomain) {
               
                        if (!domain.startForced) 
                            domain.start = (domain.start !== undefined ? Math.min(domain.start, value) : value);

                        if (!domain.endForced)
                            domain.end = (domain.end !== undefined ? Math.max(domain.end, value) : value);
                    }

                    if (addRegularTooltip) {

                        let formattedValue = OKVizUtility.Formatter.format(value, {
                            format: dataValue.source.format,
                            formatSingleValues: true,
                            allowFormatBeautification: false
                        });
                        
                        dataPoint.tooltips.push(<VisualTooltipDataItem>{
                            displayName: dataValue.source.displayName,
                            color: (color || '#333'),
                            value: formattedValue
                        });
                    }
                }

                dataPoints.push(dataPoint);
            }
        }

        if (!domain.start) domain.start = 0;
        if (!domain.end) domain.end = 0;
        if (domain.start > domain.end) 
            domain.end = domain.start;
            
        return {
            dataPoints: dataPoints,
            legendDataPoints: legendDataPoints,
            domain: domain,
            settings: settings,
            hasHighlights: hasHighlights,
            hasCategories: hasCategories
        };
    }


    export class Visual implements IVisual {
        private host: IVisualHost;
        private selectionIdBuilder: ISelectionIdBuilder;
        private selectionManager: ISelectionManager;
        private tooltipServiceWrapper: ITooltipServiceWrapper;
        private model: VisualViewModel;

        private element: d3.Selection<HTMLElement>;

        constructor(options: VisualConstructorOptions) {

            this.host = options.host;
            this.selectionIdBuilder = options.host.createSelectionIdBuilder();
            this.selectionManager = options.host.createSelectionManager();
            this.tooltipServiceWrapper = createTooltipServiceWrapper(options.host.tooltipService, options.element);
            this.model = { dataPoints: [], legendDataPoints:[], domain: {startForced: false, endForced: false},  settings: <VisualSettings>{}, hasHighlights: false, hasCategories: false };

            this.element = d3.select(options.element);
        }

        public update(options: VisualUpdateOptions) {
            this.model = visualTransform(options, this.host);
            this.element.selectAll('div, svg').remove();
            if (this.model.dataPoints.length == 0) return; 

            let isVertical = (this.model.settings.general.orientation === 'v');
            let margin = { top: 10, left: 2, bottom: 0, right: 0 }; //Space from boundaries
            let bulletPadding = 1; //Space between charts
            let labelPadding = 8; //Space between label and chart
            let axisSize = { width: 40, height: 20 };
            let scrollbarMargin = 25;

            //Clone domain - the ugly way
            let domain: VisualDomain = {start: this.model.domain.start, end: this.model.domain.end, startForced: this.model.domain.startForced, endForced: this.model.domain.endForced };

            //Axis Formatter
            let xFormatter;
            if (this.model.settings.axis.show) {
                
                xFormatter = OKVizUtility.Formatter.getFormatter({
                    format: this.model.dataPoints[0].format,
                    formatSingleValues: (this.model.settings.axis.unit == 0),
                    value: this.model.settings.axis.unit,
                    precision: this.model.settings.axis.precision,
                    displayUnitSystemType: 0,
                    allowFormatBeautification: true
                });

                axisSize.width = TextUtility.measureTextWidth({
                    fontSize: '11px',
                    fontFamily: 'sans-serif',
                    text: xFormatter.format(domain.end)
                });
            }

            
            if (this.model.settings.axis.show) {
                if (isVertical) {
                    margin.left += axisSize.width;
                } else {
                    margin.bottom += axisSize.height;
                }
            }

            let containerSize = {
                width: options.viewport.width - margin.left - margin.right,
                height: options.viewport.height - margin.top - margin.bottom
            };


            //Pre-calculate data labels size 1
            let maxLabelWidth = 0;
            for (let i = 0; i < this.model.dataPoints.length; i++) {
                let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                let props = { text: (this.model.settings.label.text && this.model.dataPoints.length <= 1 ? this.model.settings.label.text : this.model.dataPoints[i].displayName), fontFamily: 'sans-serif', fontSize: fontSize };
                let labelWidth = TextUtility.measureTextWidth(props);
                maxLabelWidth = Math.max(maxLabelWidth, labelWidth);
            }
            maxLabelWidth += 2;
            let userLimits = {
                min: (this.model.settings.general.minHeight && this.model.settings.general.minHeight > 0 ? this.model.settings.general.minHeight : 16),
                max: (this.model.settings.general.maxHeight && this.model.settings.general.maxHeight > 0 ? this.model.settings.general.maxHeight : containerSize.height)

            }

            let slotSize; 
            if (isVertical) {
                slotSize = {   
                    width: 
                        Math.min(userLimits.max, 
                            Math.max(userLimits.min, 
                                containerSize.width / this.model.dataPoints.length)),
                    height: containerSize.height - scrollbarMargin,
                };
            } else {

                slotSize = {
                    width: (containerSize.width - scrollbarMargin),
                    height: 
                        Math.min(userLimits.max, 
                            Math.max(userLimits.min, 
                                ((containerSize.height - (this.model.dataPoints.length > 1 ? 5 : 0)) / this.model.dataPoints.length)))
                };
            }

            //Pre-calculate labels size 2
            let labelRotation = 0;
            let labelSize = { width: 0, height: 0};
            if (this.model.settings.label.show) {

                labelSize.height = this.model.settings.label.fontSize * 1.2;

                if (isVertical) {

                    if (slotSize.width > maxLabelWidth * 0.6 && (!this.model.settings.label.autoSize || maxLabelWidth <= (slotSize.width - (bulletPadding * 2)))) {
                        labelSize.width = slotSize.width - (bulletPadding * 2);

                    } else if (slotSize.width < 20 || this.model.settings.label.autoSize) {
                        labelRotation = -90;
                        labelSize.width = (this.model.settings.label.autoSize ? maxLabelWidth : Math.min(maxLabelWidth, slotSize.height * 0.25));

                    } else if (slotSize.width < 45) {
                        labelRotation = -35;
                        labelSize.width = Math.min(maxLabelWidth, slotSize.height * 0.25);
                
                    }

                } else {

                    if (this.model.settings.label.autoSize) {
                        labelSize.width = maxLabelWidth;
                    } else {
                        labelSize.width = Math.min(maxLabelWidth, slotSize.width * 0.25);
                    }
                }
            }

            let bulletContainer =  this.element
                .append('div')
                .classed('chart', true)
                .style({
                    'width' :  containerSize.width + 'px',
                    'height':  containerSize.height + 'px',
                    'overflow-x': (isVertical ? (this.model.dataPoints.length > 1 ? 'auto' : 'hidden') : 'hidden'),
                    'overflow-y': (isVertical ? 'hidden' : (this.model.dataPoints.length > 1 ? 'auto' : 'hidden')),
                    'margin-top': margin.top + 'px',
                    'margin-left': margin.left + 'px'
                });

            
            let svgBulletContainer = bulletContainer
                .append('svg')
                .attr({
                    width: (isVertical ?  (this.model.dataPoints.length * slotSize.width) :  slotSize.width),
                    height: (isVertical ? '100%' : (this.model.dataPoints.length * slotSize.height))
                });

             let svgAxisContainer = this.element
                .append('svg')
                 .attr({
                    width: '100%',
                    height:'100%'
                })
                .style({
                    'position': 'absolute',
                    'top': margin.top + 'px',
                    'left': margin.left + 'px',
                    'z-index': '-999',
                    'overflow': 'visible'
                });
            
             let bulletSize = {
                    width: (isVertical ? slotSize.width - (bulletPadding * 2) : slotSize.width - labelSize.width - labelPadding),
                    height: (isVertical ? slotSize.height - labelPadding - (labelRotation == 0 ? labelSize.height : labelSize.width) : slotSize.height - (bulletPadding * 2))
                };

            //Scale
            let scale = d3.scale.linear()
                    .domain(isVertical ? [domain.end, domain.start] : [domain.start, domain.end])
                    .range(isVertical ? [bulletSize.height, 0] : [0, bulletSize.width]).nice().nice(); //See https://github.com/d3/d3-scale/issues/9

            let axisScale = (isVertical ? d3.scale.linear().domain([domain.start, domain.end]).range([bulletSize.height, 0]).nice().nice() : scale);

            domain.start = axisScale.domain()[0];
            domain.end = axisScale.domain()[1];
                
            //Render bullets
            for (let i = 0; i < this.model.dataPoints.length; i++) {
                let dataPoint = this.model.dataPoints[i];
                
                let isNegative = (dataPoint.value < 0);

                let svgBullet = svgBulletContainer
                    .append('g')
                    .classed('bullet', true)
                    .data([dataPoint]);

                let bulletPosition = {
                    x: (isVertical ?  (i * slotSize.width) : 0),
                    y: (isVertical ? 0 : (i * slotSize.height))
                };

                //Check if passed a target
                let targetIndex = -1;
                for (let ii = 0; ii < dataPoint.targets.length; ii++) {
                    let target = dataPoint.targets[ii];

                    let found = false;
                    if (this.model.settings.targets.comparison == '>') {
                        found = (dataPoint.value > target.value);

                    } else if (this.model.settings.targets.comparison == '>=') {
                        found = (dataPoint.value >= target.value);

                    } else if (this.model.settings.targets.comparison == '<') {
                        found = (dataPoint.value < target.value);

                    } else if (this.model.settings.targets.comparison == '<=') {
                        found = (dataPoint.value <= target.value);

                    } else { //=
                        found = (dataPoint.value == target.value);

                    }

                    //State found -> exit
                    if (found) {
                        targetIndex = ii;
                        break;
                    }
                }




                //Label
                if (this.model.settings.label.show) {

                    let g = svgBullet.append('g');
                        g.append('title').text(dataPoint.displayName);

                    let label = g.append('text')
                        .classed('label', true);
                        
                    let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                    let props = { text: (this.model.settings.label.text && this.model.dataPoints.length <= 1 ? this.model.settings.label.text : dataPoint.displayName), fontFamily: 'sans-serif', fontSize: fontSize};

                    let labelPos = { 
                        x:  bulletPosition.x + (isVertical ? (slotSize.width / 2) - (labelRotation == -90 ? ((labelSize.width - labelSize.height) / 2) : (labelRotation == -35 ? labelSize.height * 2 : 0 )) : labelSize.width),
                        y : bulletPosition.y + (isVertical ? slotSize.height - labelPadding - (labelRotation == 0 ? 0 : labelSize.width + (labelRotation == -90 ? (labelSize.width / 2) : (labelRotation == -35 ? labelSize.height : 0))):  (slotSize.height / 2) + bulletPadding) 
                    };

                    label.text(TextUtility.getTailoredTextOrDefault(props, labelSize.width))
                        .attr('x', labelPos.x)
                        .attr('y', labelPos.y)
                        .attr('dominant-baseline', 'middle')
                        .style('font-size', props.fontSize)
                        .attr('text-anchor', (isVertical && labelRotation == 0 ? 'middle' : 'end'))
                        .attr('fill', this.model.settings.label.fill.solid.color);

                    if (isVertical && labelRotation < 0) {
                        label
                            .attr('transform', 'rotate(' + labelRotation + ' ' + (labelPos.x + (labelSize.width / 2)) + ' ' + (labelPos.y + (labelSize.height / 2)) + ')');
                        if (labelRotation == -35)
                            label.attr('dy', '1em').attr('dx', '1em');
                    }
                }

                 
                 let bulletSize = {
                     width: (isVertical ? slotSize.width - (bulletPadding * 2) : slotSize.width - labelSize.width - labelPadding),
                     height: (isVertical ? slotSize.height - labelPadding - (labelRotation == 0 ? labelSize.height : labelSize.width) : slotSize.height - (bulletPadding * 2))
                 };
                
                let changeOpacity = (this.model.hasHighlights && (!dataPoint.highlightValue || dataPoint.highlightValue == 0));

                //States
                if (this.model.settings.states.show) {
                    let states = dataPoint.states.slice();

                    if (states.length == 0) {

                        //Manual states
                        for (let s = 1; s <= 5; s++) {
                            let v = "state" + s;
                            let f = v + "Fill";

                            states.push({
                                value: this.model.settings.states[v],
                                color: this.model.settings.states[f].solid.color,
                                displayName: null,
                                format: (this.model.settings.states.calculate == 'percentage' ? '%' : ''),
                                selectionId: null
                            });
                        }
                    }

                    let lastState = domain.start;
                    for (let ii = 0; ii < states.length; ii++) {

                        let state = states[ii];

                        if (!state.value || state.value === undefined) {

                            if (state.format.indexOf('%') > -1) {
                                state.value = (((lastState - domain.start) / (domain.end - domain.start))) + 0.2;
                            } else {
                                state.value = lastState + ((domain.end - domain.start) * 0.2);
                            }
                        }
                        
                        if (state.format.indexOf('%') > -1) {
                            state.value = domain.start + ((domain.end - domain.start) * state.value);
                        }
                        
                        state.value = Math.min(domain.end, Math.max(domain.start, state.value));

                        let startScaledValue = scale(lastState);
                        let scaledValue = scale(state.value);
                        lastState = state.value;

                        let range = svgBullet.append('rect');
                        range
                            .classed('range hl', true)
                            .style('fill', state.color)
                            .attr('x', bulletPosition.x + (isVertical ? 0 : labelSize.width + labelPadding + startScaledValue))
                            .attr('y', bulletPosition.y + (isVertical ? bulletSize.height - scaledValue : 0))
                            .attr('width',  (isVertical ? bulletSize.width : scaledValue - startScaledValue))
                            .attr('height', (isVertical ? scaledValue - startScaledValue : bulletSize.height));
                        
                        if (changeOpacity)
                            range.style('opacity', '0.3');
                    } 

                }

                //Comparison
                if (dataPoint.comparisonValue) {
                    let startScaledValue = scale(dataPoint.comparisonValue < 0 ? dataPoint.comparisonValue : Math.max(0, domain.start));
                    let scaledValue = scale(dataPoint.comparisonValue< 0 ? 0 : Math.min(domain.end, dataPoint.comparisonValue));
                    let divider = 10;

                    let comparison = svgBullet
                        .append('rect')
                        .classed('comparisonMeasure hl', true)
                        .style('fill', dataPoint.comparisonColor);

                    comparison
                        .attr('x', bulletPosition.x + (isVertical ? bulletSize.width / divider : labelSize.width + labelPadding + startScaledValue))
                        .attr('y', bulletPosition.y + (isVertical ? bulletSize.height - scaledValue : bulletSize.height / divider))
                        .attr('width', (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue))
                        .attr('height', (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2));

                    if (changeOpacity)
                        comparison.style('opacity', '0.3');
                        
                }

                //Value
                let bulletColor = (targetIndex > -1 ? (dataPoint.targets[targetIndex].color ? dataPoint.targets[targetIndex].color : dataPoint.color) : dataPoint.color);
                let measurePos = {x:0, y:0}
                if (dataPoint.value) {

                    let startScaledValue = scale(isNegative? dataPoint.value: Math.max(0, domain.start));
                    let scaledValue = scale(isNegative ? 0 : Math.min(domain.end, dataPoint.value));

                    let divider = (dataPoint.comparisonValue ? 3 : 5);

                    let measure = svgBullet
                        .append('rect')
                        .classed('measure hl', true)
                        .style('fill', bulletColor);
                    
                    measurePos = {
                        x: bulletPosition.x + (isVertical ? bulletSize.width / divider : labelSize.width + labelPadding + startScaledValue),
                        y: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue : bulletSize.height / divider)
                    }
                    measure
                        .attr('x', measurePos.x)
                        .attr('y', measurePos.y)
                        .attr('width', (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue))
                        .attr('height', (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2));

                    //Highlight value
                    if (this.model.hasHighlights)
                        measure.style('opacity', '0.3');
                }

                if (dataPoint.highlightValue) {

                    let startScaledValue = scale(dataPoint.highlightValue < 0 ? dataPoint.highlightValue: Math.max(0, domain.start));
                    let scaledValue = scale(dataPoint.highlightValue < 0 ? 0 : Math.min(domain.end, dataPoint.highlightValue));

                    let divider = (dataPoint.comparisonValue ? 3 : 5);

                    let measure = svgBullet
                        .append('rect')
                        .classed('highligthedMeasure', true)
                        .style('fill', bulletColor);
                    
                    measurePos = {
                        x: bulletPosition.x + (isVertical ? bulletSize.width / divider : labelSize.width + labelPadding + startScaledValue),
                        y: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue : bulletSize.height / divider)
                    }
                    measure
                        .attr('x', measurePos.x)
                        .attr('y', measurePos.y)
                        .attr('width', (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue))
                        .attr('height', (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2));
                }

               

                //Targets
                let markerColor = this.model.settings.targets.markerFill.solid.color;
                let markerStroke = Math.max(2, ((isVertical ? bulletSize.width : bulletSize.height) / 15));
                
                for (let ii = 0; ii < dataPoint.targets.length; ii++) {
                    
                    let target = dataPoint.targets[ii];

                    if (target && target.value >= domain.start && target.value <= domain.end) {
                        let scaledValue = scale(target.value);

                        if (target.marker == 'line') {

                            let targetPos = {
                                x1: bulletPosition.x + (isVertical ? (bulletPadding * 2) : labelSize.width + labelPadding + scaledValue - (markerStroke / 2)),
                                x2: bulletPosition.x + (isVertical ? bulletSize.width - (bulletPadding * 2): labelSize.width + labelPadding + scaledValue - (markerStroke / 2)),
                                y1: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue  - (markerStroke / 2): (bulletPadding * 2)),
                                y2: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue  - (markerStroke / 2): bulletSize.height - (bulletPadding * 2))
                            }

                            svgBullet
                                .append('line')
                                .classed('marker hl', true)
                                .attr('x1',targetPos.x1)
                                .attr('x2', targetPos.x2)
                                .attr('y1', targetPos.y1)
                                .attr('y2', targetPos.y2)
                                .style({
                                    'stroke': markerColor,
                                    'stroke-width': markerStroke,
                                })
                                .style('opacity', (changeOpacity ? '0.3': '1'));

                        } else if (target.marker == 'cross') {
                            
                            let markerMargin = bulletPadding * 5;
                            let markerSize = (isVertical ? bulletSize.width : bulletSize.height) / 5 ;

                            let targetPos = {
                                x1: bulletPosition.x + (isVertical ? markerMargin : labelSize.width + labelPadding + scaledValue - markerSize),
                                x2: bulletPosition.x + (isVertical ? bulletSize.width - markerMargin : labelSize.width + labelPadding + scaledValue + markerSize),
                                y1: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue - markerSize: markerMargin ),
                                y2: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue + markerSize : bulletSize.height - markerMargin)
                            };

                             svgBullet
                                .append('line')
                                .classed('marker hl', true)
                                .attr('x1', targetPos.x1)
                                .attr('x2', targetPos.x2)
                                .attr('y1', targetPos.y1)
                                .attr('y2', targetPos.y2)
                                .style({
                                    'stroke': markerColor,
                                    'stroke-width': markerStroke
                                })
                                .style('opacity', (changeOpacity ? '0.3': '1'));

                            svgBullet
                                .append('line')
                                .classed('marker hl', true)
                                .attr('x1', targetPos.x2)
                                .attr('x2', targetPos.x1)
                                .attr('y1', targetPos.y1)
                                .attr('y2', targetPos.y2)
                                .style({
                                    'stroke': markerColor,
                                    'stroke-width': markerStroke
                                })
                                .style('opacity', (changeOpacity ? '0.3': '1'));

                        } else if (target.marker == 'circle') {

                            let targetPos = {
                                x: bulletPosition.x + (isVertical ? (bulletSize.width / 2) : labelSize.width + labelPadding + scaledValue - (markerStroke / 2)),
                                y: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue  - (markerStroke / 2): (bulletSize.height / 2))
                            }

                            svgBullet
                                .append('circle')
                                .classed('marker hl', true)
                                .attr('cx', targetPos.x)
                                .attr('cy', targetPos.y)
                                .attr('r', markerStroke * 2)
                                .attr('fill', markerColor)
                                .style('opacity', (changeOpacity ? '0.3': '1'));
                        }
                    }
                }


                //Data Label
                if (dataPoint.value && (!this.model.hasHighlights || dataPoint.highlightValue > 0)  && this.model.settings.dataLabels.show) {
                    let dataPointValue = (this.model.hasHighlights ? dataPoint.highlightValue : dataPoint.value);

                    let startScaledValue = scale(isNegative ? dataPointValue: Math.max(0, domain.start));
                    let scaledValue = scale(isNegative ? 0 : Math.min(domain.end, dataPointValue));

                    let dataLabel = svgBullet.append('text')
                        .classed('dataLabel', true);

                    let formattedValue = OKVizUtility.Formatter.format(dataPointValue, {
                        format: dataPoint.format,
                        formatSingleValues: (this.model.settings.dataLabels.unit == 0),
                        value: this.model.settings.dataLabels.unit,
                        precision: this.model.settings.dataLabels.precision,
                        displayUnitSystemType: 2,
                        allowFormatBeautification: false
                    });

                    let fontSize = PixelConverter.fromPoint(this.model.settings.dataLabels.fontSize);
                    let props = { text: formattedValue, fontFamily: "'wf_standard-font',helvetica,arial,sans-serif", fontSize: fontSize };
                    let dataLabelSize = {
                        width:  TextUtility.measureTextWidth(props),
                        height: PixelConverter.fromPointToPixel(this.model.settings.dataLabels.fontSize) * 1.2
                    };
       
                    let dataLabelFill = this.model.settings.dataLabels.fill.solid.color;
                    
                    let showDataLabel = true;
                    let dataLabelPos;
  
                    if (isVertical) {

                        dataLabelPos = { 
                            x:  bulletPosition.x + (slotSize.width / 2),
                            y : bulletPosition.y + (bulletSize.height - scaledValue - labelPadding)
                        };
                        

                        let labelPosRange = {
                            min: bulletPosition.y,
                            max: bulletPosition.y + bulletSize.height - labelPadding + dataLabelSize.height
                        };

                        if (bulletSize.height < labelPadding + dataLabelSize.height) {
                            showDataLabel = false;
                        } else {
                            if (dataLabelPos.y > labelPosRange.max)
                                dataLabelPos.y = labelPosRange.max;
                            if (dataLabelPos.y < labelPosRange.min)
                                dataLabelPos.y = labelPosRange.min;

                            if (dataLabelPos.y > labelPosRange.max || dataLabelPos.y < labelPosRange.min)
                                showDataLabel = false;

                            /*if (dataLabelPos.y > (bulletSize.height - measurePos.y) && dataLabelPos.y + (dataLabelSize.height / 3 * 2) < (bulletSize.height - measurePos.y) + (scaledValue - startScaledValue)) {
                                dataLabelFill = '#fff';
                            }*/
                        }

                    } else {

                        dataLabelPos = { 
                            x:  bulletPosition.x + labelSize.width + labelPadding + (isNegative? startScaledValue - labelPadding: scaledValue + labelPadding),
                            y : bulletPosition.y + (slotSize.height / 2)
                        };

                        let labelPosRange = {
                            min: bulletPosition.x + labelSize.width + labelPadding + (isNegative ? dataLabelSize.width + labelPadding : 0),
                            max: bulletPosition.x + labelSize.width + labelPadding + bulletSize.width - (isNegative ? 0 : dataLabelSize.width + labelPadding)
                        };

                         if (bulletSize.width < labelPadding + dataLabelSize.width) {
                            showDataLabel = false;
                         } else {
                            if (dataLabelPos.x > labelPosRange.max)
                                dataLabelPos.x = labelPosRange.max;
                            if (dataLabelPos.x < labelPosRange.min)
                                dataLabelPos.x = labelPosRange.min;

                            if (dataLabelPos.x > labelPosRange.max || dataLabelPos.x < labelPosRange.min)
                                showDataLabel = false;

                            if (dataLabelPos.x - (isNegative ? (dataLabelSize.width / 3 * 2) : 0) > measurePos.x && dataLabelPos.x + (isNegative ? 0 : (dataLabelSize.width / 3 * 2)) < measurePos.x + (scaledValue - startScaledValue)) {
                                dataLabelFill = '#fff';
                            }
                         }
                    }

                    if (showDataLabel) {
                        dataLabel.text(props.text)
                            .attr('x', dataLabelPos.x)
                            .attr('y', dataLabelPos.y)
                            .attr('dominant-baseline', 'middle')
                            .style('font-size', props.fontSize)
                            .attr('text-anchor', (isVertical ? 'middle' : (isNegative? 'end' : 'start')))
                            .attr('fill', dataLabelFill);
                    }
                }

            }

            //Tooltips
            this.tooltipServiceWrapper.addTooltip(svgBulletContainer.selectAll('.bullet'), 
                function(tooltipEvent: TooltipEventArgs<number>){
                    let dataPoint: VisualDataPoint = tooltipEvent.data;
                    if (dataPoint && dataPoint.tooltips)
                        return dataPoint.tooltips;
                    
                    return null;
                }, 
                (tooltipEvent: TooltipEventArgs<number>) => null
            );

            //Axis
            if (this.model.settings.axis.show) {

                let numTicks = Math.max(Math.floor(isVertical ? bulletSize.height / 30 :  bulletSize.width / 80), 2);

                /*
                let ticksArr = axisScale.ticks(numTicks);
                if (numTicks < 2) ticksArr.unshift(domain.start);
                let interval = ticksArr[1] - ticksArr[0];
                if (ticksArr[0] != domain.start) {
                    if (ticksArr[0] - domain.start < interval / 2) ticksArr.shift();
                    ticksArr.unshift(domain.start);
                }
                xAxis.tickValues(ticksArr)
                */
                let xAxis = d3.svg.axis().ticks(numTicks).outerTickSize(0).tickFormat(d => xFormatter.format(d)).tickSize((isVertical ? containerSize.width : Math.min((slotSize.height * this.model.dataPoints.length), containerSize.height)  + labelPadding)).orient(isVertical ? "left" : "bottom");

                let axis = svgAxisContainer.selectAll("g.axis").data([0]);
                axis.enter().append("g")
                    .attr("class", "axis")
                    .attr('transform', 'translate(' + (isVertical ? containerSize.width: labelSize.width + labelPadding) + ',0)');

                axis.call(xAxis.scale(axisScale));
                axis.selectAll('line').style('stroke', this.model.settings.axis.fill.solid.color);
                axis.selectAll('text').style('fill', this.model.settings.axis.fill.solid.color);


            }

            let selectionManager  = this.selectionManager;
            d3.selectAll('.bullet').on('click', function(d) {

                selectionManager.select(d.selectionId).then((ids: ISelectionId[]) => {
                    
                    d3.selectAll('.hl').attr({
                        'opacity': (ids.length > 0 ? 0.3 : 1)
                    });

                    d3.select(this).selectAll('.hl').attr({
                        'opacity': 1
                    });
                });

                (<Event>d3.event).stopPropagation();
            });


            OKVizUtility.t(['Bullet Chart', '2.1.0'], this.element, options, this.host, {
                'cd1': this.model.settings.colorBlind.vision, 
                'cd2': this.model.dataPoints[0].targets.length, 
                'cd3': this.model.settings.targets.comparison,
                'cd6': false, //TODO Change when Legend will be available
                'cd12': this.model.settings.general.orientation
            });

            //Color Blind module
            OKVizUtility.applyColorBlindVision(this.model.settings.colorBlind.vision, this.element);
        }


        public destroy(): void {
 
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var objectName = options.objectName;
            var objectEnumeration: VisualObjectInstance[] = [];

            if (this.model.dataPoints.length == 0) return;

            let dataPoint = this.model.dataPoints[0];

            switch(objectName) {

                case 'general':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "orientation": this.model.settings.general.orientation,
                            "minHeight": this.model.settings.general.minHeight,
                            "maxHeight": this.model.settings.general.maxHeight
                        },
                        selector: null
                    });
                    break;

                case "dataPoint":

                    if (this.model.hasCategories) {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                "defaultFill" : this.model.settings.dataPoint.defaultFill,
                                "showAll": this.model.settings.dataPoint.showAll
                            },
                            selector: null
                        });
                 
                        if (this.model.settings.dataPoint.showAll) {
                            let maxDataPoints = 1000;
                            for(let i = 0; i < Math.min(maxDataPoints, this.model.legendDataPoints.length); i++) {
                                let legendDataPoint = this.model.legendDataPoints[i];

                                if (legendDataPoint.showOnDemand) {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        displayName: legendDataPoint.displayName,
                                        properties: {
                                            "fill": {
                                                solid: {
                                                    color: legendDataPoint.color
                                                }
                                            }
                                        },
                                        selector: legendDataPoint.selectionId.getSelector()
                                    });
                                }
                            }
                        }
                    }

                    for(let i = 0; i < this.model.legendDataPoints.length; i++) {
                        let legendDataPoint = this.model.legendDataPoints[i];

                        if (!legendDataPoint.showOnDemand) {
                            objectEnumeration.push({
                                objectName: objectName,
                                displayName: legendDataPoint.displayName,
                                properties: {
                                    "fill": {
                                        solid: {
                                            color: legendDataPoint.color
                                        }
                                    }
                                },
                                selector: legendDataPoint.selectionId.getSelector()
                            });
                        }
                    }

                    break;

                case 'label':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "show": this.model.settings.label.show
                        },
                        selector: null
                    });

                    if (this.model.dataPoints.length <= 1) {
                        objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                "text": this.model.settings.label.text
                            },
                            selector: null
                        });
                    }
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "fontSize": this.model.settings.label.fontSize,
                            "autoSize": this.model.settings.label.autoSize,
                            "fill": this.model.settings.label.fill
                        },
                        selector: null
                    });

                    break;

                case 'dataLabels':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "show": this.model.settings.dataLabels.show,
                            "fill": this.model.settings.dataLabels.fill,
                            "fontSize": this.model.settings.dataLabels.fontSize,
                            "unit": this.model.settings.dataLabels.unit,
                            "precision": this.model.settings.dataLabels.precision
                        },
                        selector: null
                    });
                    break;

                case 'targets':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "markerFill": this.model.settings.targets.markerFill,
                            "comparison": this.model.settings.targets.comparison,
                            "baseFill": "" //Keep placeholder fixed
                        },
                        selector: null
                    });
                    
                    if (dataPoint.targets && dataPoint.targets.length > 0) {

                        for (let i = 0; i < dataPoint.targets.length; i++){
                            let targetDataPoint = dataPoint.targets[i];
                            objectEnumeration.push({
                                objectName: objectName,
                                displayName: targetDataPoint.displayName,
                                properties: {
                                    "fill": {
                                        solid: {
                                            color: targetDataPoint.color
                                        }
                                    }
                                },
                                selector: targetDataPoint.selectionId.getSelector()
                            });

                            objectEnumeration.push({
                                objectName: objectName,
                                displayName: targetDataPoint.displayName + " marker",
                                properties: {
                                    "marker": targetDataPoint.marker
                                },
                                selector: targetDataPoint.selectionId.getSelector()
                            });
                        }
                    } 

                    break;

                case "states":
                   
                    if (dataPoint.states && dataPoint.states.length > 0) {
                        
                        for (let i = 0; i < dataPoint.states.length; i++){
                            let stateDataPoint = dataPoint.states[i];

                             objectEnumeration.push({
                                objectName: objectName,
                                displayName: stateDataPoint.displayName,
                                properties: {
                                    "fill": {
                                        solid: {
                                            color: stateDataPoint.color
                                        }
                                    }
                                },
                                selector: (stateDataPoint.selectionId ? stateDataPoint.selectionId.getSelector() : null)
                            });
                        }

                    } else {
                         objectEnumeration.push({
                            objectName: objectName,
                            properties: {
                                "show": this.model.settings.states.show,
                                "calculate": this.model.settings.states.calculate            
                            },
                            selector: null
                        });

                        for (let i = 1; i <= 5; i++) {

                            let v = "state" + i;
                            let f = v + "Fill";

                            let s: any = {};
                            s[f] = this.model.settings.states[f];
                            s[v] = this.model.settings.states[v];

                            objectEnumeration.push({
                                objectName: objectName,
                                properties: s,
                                selector: null
                            });
                        }
                    }


                    break;

                case 'axis':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "show": this.model.settings.axis.show,
                            "start": this.model.settings.axis.start,
                            "end": this.model.settings.axis.end,
                            "fill": this.model.settings.axis.fill,
                            "unit": this.model.settings.axis.unit,
                            "precision": this.model.settings.axis.precision
                        },
                        selector: null
                    });

                    break;
                
                 case 'colorBlind':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "vision": this.model.settings.colorBlind.vision
                        },
                        selector: null
                    });

                    break;
                

            };

            return objectEnumeration;
        }
    }
}