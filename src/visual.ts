/*
 *  Bullet Chart by OKViz
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

import tooltip = powerbi.extensibility.utils.tooltip;
import TooltipEnabledDataPoint = powerbi.extensibility.utils.tooltip.TooltipEnabledDataPoint;
import TooltipEventArgs = powerbi.extensibility.utils.tooltip.TooltipEventArgs;

module powerbi.extensibility.visual {

    interface VisualMeta {
        name: string;
        version: string;
        dev: boolean;
    }

    interface VisualViewModel {
        dataPoints: VisualDataPoint[];
        enumerationDataPoints: VisualEnumerationDataPoint[];
        legendDataPoints: LegendDataPoint[];
        legendDataPointsWithCustomIcons: LegendCustomIcon[];
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

    interface VisualEnumerationDataPoint {
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
            fontFamily: string;
            fontSize: number;
            fill: Fill;
            autoSize: boolean;
        };
        dataLabels : {
            show: boolean;
            fontFamily: string;
            fontSize: number;
            fill: Fill;
            unit?: number; 
            precision?: number; 
            locale?: string;
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
            fontSize: number;
            fontFamily: string;
            unit?: number;
            precision?: number; 
            locale?: string;
        };
        legend: {
            show: boolean;
            position: string;
            showTitle: boolean;
            titleText: string;
            labelColor: Fill;
            fontSize: number;
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
               fontFamily: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif',
               fill: {solid: { color: "#777" } },
               autoSize: true
           },
           dataLabels: {
               show: false,
               fill: {solid: { color: "#777" } },
                fontFamily: 'wf_standard-font,helvetica,arial,sans-serif',
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
                fontFamily: '"Segoe UI", wf_segoe-ui_normal, helvetica, arial, sans-serif',
               fontSize: 8,
               fill: {solid: { color: "#777" } },
               unit: 0
            },
            legend: {
                show: false,
                position: 'Top',
                showTitle: false,
                titleText: '',
                labelColor: {solid: { color: "#666" } },
                fontSize: 8
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
                    fontFamily: getValue<string>(objects, "label", "fontFamily", settings.label.fontFamily),
                    fill: getValue<Fill>(objects, "label", "fill", settings.label.fill),
                    autoSize: getValue<boolean>(objects, "label", "autoSize", settings.label.autoSize)
                },
                dataLabels: {
                    show: getValue<boolean>(objects, "dataLabels", "show", settings.dataLabels.show),
                    fontFamily: getValue<string>(objects, "dataLabels", "fontFamily", settings.dataLabels.fontFamily),
                    fontSize: getValue<number>(objects, "dataLabels", "fontSize", settings.dataLabels.fontSize),
                    fill: getValue<Fill>(objects, "dataLabels", "fill", settings.dataLabels.fill),
                    unit: getValue<number>(objects, "dataLabels", "unit", settings.dataLabels.unit),
                    precision: getValue<number>(objects, "dataLabels", "precision", settings.dataLabels.precision),
                    locale: getValue<string>(objects, "dataLabels", "locale", settings.dataLabels.locale)
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
                    fontFamily: getValue<string>(objects, "axis", "fontFamily", settings.axis.fontFamily),
                    fontSize: getValue<number>(objects, "axis", "fontSize", settings.axis.fontSize),
                    fill: getValue<Fill>(objects, "axis", "fill", settings.axis.fill),
                    unit: getValue<number>(objects, "axis", "unit", settings.axis.unit),
                    precision: getValue<number>(objects, "axis", "precision", settings.axis.precision),
                    locale: getValue<string>(objects, "axis", "locale", settings.axis.locale)
                },
                legend: {
                    show: getValue<boolean>(objects, "legend", "show", settings.legend.show),
                    position: getValue<string>(objects, "legend", "position", settings.legend.position),
                    showTitle: getValue<boolean>(objects, "legend", "showTitle", settings.legend.showTitle),
                    titleText: getValue<string>(objects, "legend", "titleText", settings.legend.titleText),
                    labelColor: getValue<Fill>(objects, "legend", "labelColor", settings.legend.labelColor),
                    fontSize: getValue<number>(objects, "legend", "fontSize", settings.legend.fontSize)
                },

                colorBlind: {
                     vision: getValue<string>(objects, "colorBlind", "vision", settings.colorBlind.vision),
                }
            }
            //Adjust some properties
            if (settings.dataLabels.locale == '') settings.dataLabels.locale = host.locale;
            if (settings.axis.locale == '') settings.axis.locale = host.locale;
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
        let enumerationDataPoints: VisualEnumerationDataPoint[] = [];
        let legendDataPoints: LegendDataPoint[] = [];
        let legendDataPointsWithCustomIcons: LegendCustomIcon[] = [];
        let hasCategories = false;

        if (hasCategoricalData) {
            let dataCategorical = dataViews[0].categorical;
            let category = (dataCategorical.categories ? dataCategorical.categories[dataCategorical.categories.length - 1] : null);
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
                    let checkDomain = false;
                    let value: any = dataValue.values[i];
                    let color: any;
                    let tooltipsFormatter = OKVizUtility.Formatter.getFormatter({
                        format: dataValue.source.format,
                        formatSingleValues: false,
                        allowFormatBeautification: false,
                        cultureSelector: settings.dataLabels.locale
                    });

                    if (dataValue.source.roles['Value']){ //value -> Value for legacy compatibility
                 
                        //if (value !== null) { //This cause problems when there is a comparison measure

                            dataPoint.value = value;
                            dataPoint.format = dataValue.source.format;
                            let headerName;
                            let displayName;
                            let identity;

                            if (category) {

                                identity = host.createSelectionIdBuilder().withCategory(category, i).createSelectionId();

                                displayName = OKVizUtility.makeMeasureReadable(categories[i]);
                                if (Object.prototype.toString.call(displayName) === '[object Date]') {
                                    displayName = OKVizUtility.Formatter.format(displayName, {
                                        format: category.source.format,
                                        value: displayName,
                                        cultureSelector: settings.dataLabels.locale
                                    }); 
                                }

                                if (settings.dataPoint.showAll) {
                                    let defaultColor: Fill = { solid: { color: host.colorPalette.getColor(displayName).value } };

                                    color = getCategoricalObjectValue<Fill>(category, i, 'dataPoint', 'fill', defaultColor).solid.color;
                                } else {
                                    color = settings.dataPoint.defaultFill.solid.color;
                                }
                                hasCategories = true;
                                showOnDemand = true;

                                headerName = (displayName || "Category");

                            } else {

                                identity = host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId();

                                displayName = dataValue.source.displayName;
                                headerName = displayName;

                                let defaultColor: Fill = { solid: { color: host.colorPalette.getColor(displayName).value } };

                                color = getValue<Fill>(dataValue.source.objects, 'dataPoint', 'fill', defaultColor).solid.color;

                            }

                            dataPoint.displayName = String(displayName);
                            dataPoint.color = color;
                            dataPoint.selectionId = identity;

                            enumerationDataPoints.push({
                                displayName: String(displayName),
                                color: color,
                                showOnDemand: showOnDemand,
                                selectionId: identity
                            });

                            if (i == 0) {
                                legendDataPoints.push({
                                    label: dataValue.source.displayName,
                                    color: color,
                                    icon: LegendIcon.Circle,
                                    identity: identity,
                                    selected: false
                                });
                            }

                            dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                header: headerName,
                                displayName: dataValue.source.displayName,
                                color: (color || '#333'),
                                value: tooltipsFormatter.format(value)
                            });

                            if (dataValue.highlights) {
                                dataPoint.highlightValue = <any>dataValue.highlights[i];
                                hasHighlights = true;

                                dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                    displayName: 'Highlighted',
                                    color: (color || '#333'),
                                    value: tooltipsFormatter.format(dataPoint.highlightValue)
                                });
                        
                            }

                            checkDomain = true;
                        }
                    //}

                    if (dataValue.source.roles['ComparisonValue']) { //comparison -> ComparisonValue for legacy compatibility
                        if (value !== null) {
                            dataPoint.comparisonValue = value;
                            let displayName = dataValue.source.displayName;

                            let defaultColor: Fill = { solid: { color: '#99E3DD' } };
                            color = getValue<Fill>(dataValue.source.objects, 'dataPoint', 'fill', defaultColor).solid.color;

                            dataPoint.comparisonColor = color;

                            let identity = host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId();

                            if (enumerationDataPoints.map(x => x.displayName).indexOf(displayName) === -1) {

                                enumerationDataPoints.push({
                                    displayName: String(displayName),
                                    showOnDemand: false,
                                    color: color,
                                    selectionId: identity
                                });
                            }
                            
                            if (i == 0) {
                                legendDataPoints.push({
                                    label: dataValue.source.displayName,
                                    color: color,
                                    icon: LegendIcon.Circle,
                                    identity: identity,
                                    selected: false
                                });
                            }
                            
                            dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                displayName: dataValue.source.displayName,
                                color: (color || '#333'),
                                value: tooltipsFormatter.format(value)
                            });

                            checkDomain = true;
                        }
                    }

                     if (dataValue.source.roles['targets']) {
                        if (value !== null) {
                            
                            let displayName = dataValue.source.displayName;
                            let identity = host.createSelectionIdBuilder().withMeasure(dataValue.source.queryName).createSelectionId();
                            let availableMarkers = ['line', 'cross', 'circle', 'square', 'hidden'];
                            
                            let idx = dataPoint.targets.length; 
                            if (idx >= availableMarkers.length) idx = 0;
                            let marker = getValue<string>(dataValue.source.objects, 'targets', 'marker', availableMarkers[idx]);

                            let targetColor:any = getValue<Fill>(dataValue.source.objects, 'targets', 'fill', null);
                            if (targetColor) {
                                targetColor = targetColor.solid.color;
                                color = targetColor;
                            }

                            dataPoint.targets.push({
                                 value: value,
                                 marker: marker,
                                 color: targetColor,
                                 displayName: displayName,
                                 selectionId: identity
                             }); 

                             if (i == 0) {
                                if (marker != 'hidden') {
                                    legendDataPoints.push({
                                        label: dataValue.source.displayName,
                                        color: color,
                                        icon: LegendIcon.Circle,
                                        identity: identity,
                                        selected: false
                                    });
                                    legendDataPointsWithCustomIcons.push({
                                        icon: marker,
                                        color: settings.targets.markerFill.solid.color,
                                        identity: identity
                                    });
                                }
                            }
                    
                            dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                displayName: dataValue.source.displayName,
                                color: (marker == 'hidden' ? '#333' : settings.targets.markerFill.solid.color),
                                value: tooltipsFormatter.format(value)
                            });
                            
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

                    if (dataValue.source.roles['tooltips']) {
                        if (value !== null) {
                            dataPoint.tooltips.push(<VisualTooltipDataItem>{
                                displayName: dataValue.source.displayName,
                                color: '#333',
                                value: tooltipsFormatter.format(value)
                            });
                        }
                    }

                    if (checkDomain) {
               
                        if (!domain.startForced) 
                            domain.start = (domain.start !== undefined ? Math.min(domain.start, value) : value);

                        if (!domain.endForced)
                            domain.end = (domain.end !== undefined ? Math.max(domain.end, value) : value);
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
            enumerationDataPoints: enumerationDataPoints,
            legendDataPoints: legendDataPoints,
            legendDataPointsWithCustomIcons: legendDataPointsWithCustomIcons,
            domain: domain,
            settings: settings,
            hasHighlights: hasHighlights,
            hasCategories: hasCategories
        };
    }


    export class Visual implements IVisual {
        private meta: VisualMeta;
        private host: IVisualHost;
        private selectionIdBuilder: ISelectionIdBuilder;
        private selectionManager: ISelectionManager;
        private tooltipServiceWrapper: tooltip.ITooltipServiceWrapper;
        private model: VisualViewModel;
        private licced: boolean;
        private legend: ILegend;
        private element: d3.Selection<HTMLElement>;

        constructor(options: VisualConstructorOptions) {

            this.meta = {
                name: 'Bullet Chart',
                version: '2.1.5',
                dev: false
            };

            this.host = options.host;
            this.selectionIdBuilder = options.host.createSelectionIdBuilder();
            this.selectionManager = options.host.createSelectionManager();
            this.tooltipServiceWrapper = tooltip.createTooltipServiceWrapper(options.host.tooltipService, options.element);
            this.model = { dataPoints: [], enumerationDataPoints:[], legendDataPoints:[], legendDataPointsWithCustomIcons:[], domain: {startForced: false, endForced: false},  settings: <VisualSettings>{}, hasHighlights: false, hasCategories: false };
            
            this.element = d3.select(options.element);
            this.legend = LegendModule.createLegend(options.element, false, null, true, LegendPosition.Top);
        }
        
        //@logErrors() //TODO Don't use in production
        public update(options: VisualUpdateOptions) {
            
            this.model = visualTransform(options, this.host);

            this.element.selectAll('div, svg:not(.legend)').remove();
            if (this.model.dataPoints.length == 0) return; 


            let isVertical = (this.model.settings.general.orientation === 'v');
            let margin = { top: 10, left: 2, bottom: 0, right: 0 }; //Space from boundaries
            let bulletPadding = 1; //Space between charts
            let labelPadding = 8; //Space between label and chart
            let axisSize = { width: 40, height: 20 };
            let scrollbarMargin = 25;

            //Clone domain - the ugly way
            let domain: VisualDomain = {start: this.model.domain.start, end: this.model.domain.end, startForced: this.model.domain.startForced, endForced: this.model.domain.endForced };

            //Legend
            if (this.model.settings.legend.show && this.model.legendDataPoints.length > 0) {
        
                this.legend.changeOrientation(<any>LegendPosition[this.model.settings.legend.position]);
                this.legend.drawLegend(<LegendData>{
                    title: this.model.settings.legend.titleText,
                    dataPoints: this.model.legendDataPoints,
                    labelColor: this.model.settings.legend.labelColor.solid.color,
                    fontSize: this.model.settings.legend.fontSize
                }, options.viewport);

                replaceLegendIconsWithCustom(this.model.legendDataPointsWithCustomIcons);
                
                appendLegendMargins(this.legend, margin);
  
            } else {

                this.legend.drawLegend({ dataPoints: [] }, options.viewport);
            }

            //Axis Formatter
            let xFormatter;
            let xFontSize = PixelConverter.fromPoint(this.model.settings.axis.fontSize);
            if (this.model.settings.axis.show) {
                
                xFormatter = OKVizUtility.Formatter.getFormatter({
                    format: this.model.dataPoints[0].format,
                    formatSingleValues: false,
                    value: (this.model.settings.axis.unit == 0 ? domain.end : this.model.settings.axis.unit),
                    precision: this.model.settings.axis.precision,
                    displayUnitSystemType: 0,
                    cultureSelector: this.model.settings.axis.locale
                });
                
                axisSize.width = TextUtility.measureTextWidth({
                    fontSize: xFontSize,
                    fontFamily: this.model.settings.axis.fontFamily,
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
                    'width' :  Math.max(0, containerSize.width + margin.left) + 'px',
                    'height':  Math.max(0, containerSize.height) + 'px',
                    'overflow-x': (isVertical ? (this.model.dataPoints.length > 1 ? 'auto' : 'hidden') : 'hidden'),
                    'overflow-y': (isVertical ? 'hidden' : (this.model.dataPoints.length > 1 ? 'auto' : 'hidden')),
                    'margin-top': margin.top + 'px',
                });

          
            let svgBulletContainer = bulletContainer
                .append('svg')
                .attr({
                    width: (isVertical ?  (this.model.dataPoints.length * slotSize.width) :  slotSize.width),
                    height: (isVertical ? '100%' : (this.model.dataPoints.length * slotSize.height))
                })
                .style('padding-left', margin.left + 'px');

             let svgAxisContainer = this.element
                .append('svg')
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
                let highlightedTargetIndex = -1;
                for (let ii = 0; ii < dataPoint.targets.length; ii++) {
                    let target = dataPoint.targets[ii];

                    if (this.model.settings.targets.comparison == '>') {
                        if (targetIndex == -1 && dataPoint.value > target.value)
                            targetIndex = ii;
                        if (highlightedTargetIndex == -1 && dataPoint.highlightValue > target.value)
                            highlightedTargetIndex = ii;
                    } else if (this.model.settings.targets.comparison == '>=') {
                        if (targetIndex == -1 && dataPoint.value >= target.value)
                            targetIndex = ii;
                        if (highlightedTargetIndex == -1 && dataPoint.highlightValue >= target.value)
                            highlightedTargetIndex = ii;
                    } else if (this.model.settings.targets.comparison == '<') {
                        if (targetIndex == -1 && dataPoint.value < target.value)
                            targetIndex = ii;
                        if (highlightedTargetIndex == -1 && dataPoint.highlightValue < target.value)
                            highlightedTargetIndex = ii;
                    } else if (this.model.settings.targets.comparison == '<=') {
                        if (targetIndex == -1 && dataPoint.value <= target.value)
                            targetIndex = ii;
                        if (highlightedTargetIndex == -1 && dataPoint.highlightValue <= target.value)
                            highlightedTargetIndex = ii;
                    } else { //=
                        if (targetIndex == -1 && dataPoint.value == target.value)
                            targetIndex = ii;
                        if (highlightedTargetIndex == -1 && dataPoint.highlightValue == target.value)
                            highlightedTargetIndex = ii;
                    }
                }

                let bulletSize = {
                     width: (isVertical ? slotSize.width - (bulletPadding * 2) : slotSize.width - labelSize.width - labelPadding),
                     height: (isVertical ? slotSize.height - labelPadding - (labelRotation == 0 ? labelSize.height : labelSize.width) : slotSize.height - (bulletPadding * 2))
                 };

                //Label
                if (this.model.settings.label.show) {

                    let g = svgBullet.append('g');
                        g.append('title').text(dataPoint.displayName);

                    let label = g.append('text')
                        .classed('label', true);
                    

                    let fontSize = PixelConverter.fromPoint(this.model.settings.label.fontSize);
                    let props = { text: (this.model.settings.label.text && this.model.dataPoints.length <= 1 ? this.model.settings.label.text : dataPoint.displayName), fontFamily: this.model.settings.label.fontFamily, fontSize: fontSize};

                    if (props.text == undefined || !props.text) 
                        props.text = '(Blank)';

                    let labelPos = { 
                        x:  bulletPosition.x + (isVertical ? (slotSize.width / 2) - (labelRotation == -90 ? ((labelSize.width - labelSize.height) / 2) : (labelRotation == -35 ? labelSize.height * 2 : 0 )) : labelSize.width),
                        y : bulletPosition.y + (isVertical ? slotSize.height - (labelRotation == 0 ? 0 : labelSize.width + (labelRotation == -90 ? (labelSize.width / 2) : (labelRotation == -35 ? labelSize.height + labelPadding : 0))):  (slotSize.height / 2) + bulletPadding) 
                    };

                    label.text(TextUtility.getTailoredTextOrDefault(props, (isVertical ?(labelRotation == 0 ? bulletSize.width : labelSize.width) : labelSize.width)))
                        .attr('x', labelPos.x)
                        .attr('y', labelPos.y)
                        .attr('dominant-baseline', 'middle')
                        .style('font-family', props.fontFamily)
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
                            .attr('width',  Math.max(0, (isVertical ? bulletSize.width : scaledValue - startScaledValue)))
                            .attr('height', Math.max(0, (isVertical ? scaledValue - startScaledValue : bulletSize.height)));
                        
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
                        .attr('width', Math.max(0, (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue)))
                        .attr('height', Math.max(0, (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2)));

                    if (changeOpacity)
                        comparison.style('opacity', '0.3');
                        
                }

                //Value
                let divider = (dataPoint.comparisonValue ? 3 : 5);
                let bulletColor = (targetIndex > -1 ? (dataPoint.targets[targetIndex].color ? dataPoint.targets[targetIndex].color : dataPoint.color) : dataPoint.color);
                let measurePos = {x:0, y:0}
                if (dataPoint.value) {

                    let startScaledValue = scale(isNegative? dataPoint.value: Math.max(0, domain.start));
                    let scaledValue = scale(isNegative ? 0 : Math.min(domain.end, dataPoint.value));

                    

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
                        .attr('width', Math.max(0, (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue)))
                        .attr('height', Math.max(0, (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2)));

                    //Highlight value
                    if (this.model.hasHighlights)
                        measure.style('opacity', '0.3');
                }

                if (dataPoint.highlightValue) {
                    
                    let highlightedBulletColor = (highlightedTargetIndex > -1 ? (dataPoint.targets[highlightedTargetIndex].color ? dataPoint.targets[highlightedTargetIndex].color : dataPoint.color) : dataPoint.color);

                    let startScaledValue = scale(dataPoint.highlightValue < 0 ? dataPoint.highlightValue: Math.max(0, domain.start));
                    let scaledValue = scale(dataPoint.highlightValue < 0 ? 0 : Math.min(domain.end, dataPoint.highlightValue));

                    let divider = (dataPoint.comparisonValue ? 3 : 5);

                    let measure = svgBullet
                        .append('rect')
                        .classed('highligthedMeasure', true)
                        .style('fill', highlightedBulletColor);
                    
                    measurePos = {
                        x: bulletPosition.x + (isVertical ? bulletSize.width / divider : labelSize.width + labelPadding + startScaledValue),
                        y: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue : bulletSize.height / divider)
                    }
                    measure
                        .attr('x', measurePos.x)
                        .attr('y', measurePos.y)
                        .attr('width', Math.max(0, (isVertical ? bulletSize.width - (bulletSize.width / divider) * 2 : scaledValue - startScaledValue)))
                        .attr('height', Math.max(0, (isVertical ? scaledValue - startScaledValue : bulletSize.height - (bulletSize.height / divider) * 2)));
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
                                x1: bulletPosition.x + (isVertical ? markerMargin : labelSize.width + labelPadding + scaledValue  - (markerStroke / 2) - markerSize),
                                x2: bulletPosition.x + (isVertical ? bulletSize.width - markerMargin : labelSize.width + labelPadding + scaledValue - (markerStroke / 2) + markerSize),
                                y1: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue  - (markerStroke / 2) - markerSize: markerMargin ),
                                y2: bulletPosition.y + (isVertical ? bulletSize.height - scaledValue  - (markerStroke / 2) + markerSize : bulletSize.height - markerMargin)
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

                         } else if (target.marker == 'square') {

                            let targetPos = {
                                x: bulletPosition.x + (isVertical ? (bulletSize.width / 2) - (markerStroke * 2) : labelSize.width + labelPadding + scaledValue - (markerStroke * 2) - (markerStroke / 2)),
                                y: bulletPosition.y + (isVertical ? bulletSize.height - labelPadding - scaledValue  - (markerStroke * 2): (bulletSize.height / 2) - (markerStroke * 2))
                            }

                            svgBullet
                                .append('rect')
                                .classed('marker hl', true)
                                .attr('x', targetPos.x)
                                .attr('y', targetPos.y)
                                .attr('width', markerStroke * 4)
                                .attr('height', markerStroke * 4)
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
                        formatSingleValues: false,
                        value: (this.model.settings.dataLabels.unit == 0 ? domain.end: this.model.settings.dataLabels.unit),
                        precision: this.model.settings.dataLabels.precision,
                        displayUnitSystemType: 3,
                        allowFormatBeautification: true,
                        cultureSelector: this.model.settings.dataLabels.locale
                    });

                    let fontSize = PixelConverter.fromPoint(this.model.settings.dataLabels.fontSize);
                    let props = { text: formattedValue, fontFamily: this.model.settings.dataLabels.fontFamily, fontSize: fontSize };
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

                           if (dataLabelSize.height > measurePos.y) {
                                
                                dataLabelPos.y = measurePos.y + (labelPadding * 2);

                                if (this.model.settings.dataLabels.fill.solid.color == defaultSettings().dataLabels.fill.solid.color) {
                                    dataLabelFill = '#fff';

                                    props.text = TextUtility.getTailoredTextOrDefault(props, bulletSize.width - ((bulletSize.width / divider) * 2) - labelPadding);
                                }
                            }
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
                            


                            if (dataLabelPos.x > measurePos.x && dataLabelPos.x < measurePos.x + (scaledValue - startScaledValue)) {
                                
                                dataLabelPos.x = measurePos.x + (scaledValue - startScaledValue) - dataLabelSize.width - labelPadding;

                                if (this.model.settings.dataLabels.fill.solid.color == defaultSettings().dataLabels.fill.solid.color)
                                    dataLabelFill = '#fff';
                            }
                         }
                    }

                    if (showDataLabel) {
                        dataLabel.text(props.text)
                            .attr('x', dataLabelPos.x)
                            .attr('y', dataLabelPos.y)
                            .attr('dominant-baseline', 'middle')
                            .style('font-family', props.fontFamily)
                            .style('font-size', props.fontSize)
                            .attr('text-anchor', (isVertical ? 'middle' : (isNegative? 'end' : 'start')))
                            .attr('fill', dataLabelFill);
                    }
                }

            }

            //Tooltips
            this.tooltipServiceWrapper.addTooltip(svgBulletContainer.selectAll('.bullet'), 
                function(tooltipEvent: tooltip.TooltipEventArgs<number>){
                    let dataPoint: VisualDataPoint = <any>tooltipEvent.data;
                    if (dataPoint && dataPoint.tooltips)
                        return dataPoint.tooltips;
                    
                    return null;
                }
            );

            //Axis
            if (this.model.settings.axis.show) {

                let numTicks = Math.max(Math.floor(isVertical ? bulletSize.height / 30 :  bulletSize.width / 80), 2);

                let xAxis = d3.svg.axis().ticks(numTicks).outerTickSize(0).tickFormat(d => xFormatter.format(d)).tickSize((isVertical ? containerSize.width : Math.min((slotSize.height * this.model.dataPoints.length), containerSize.height)  + labelPadding)).orient(isVertical ? "left" : "bottom");

                let axis = svgAxisContainer.selectAll("g.axis").data([0]);
                axis.enter().append("g")
                    .attr("class", "axis")
                    .attr('transform', 'translate(' + (isVertical ? containerSize.width: labelSize.width + labelPadding) + ',0)');

                axis.call(xAxis.scale(axisScale));
                axis.selectAll('line').style('stroke', this.model.settings.axis.fill.solid.color);
                axis.selectAll('text')
                    .style({
                            'fill': this.model.settings.axis.fill.solid.color,
                            'font-family': this.model.settings.axis.fontFamily,
                            'font-size': xFontSize
                        });

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
            
            OKVizUtility.t([this.meta.name, this.meta.version], this.element, options, this.host, {
                'cd1': this.model.settings.colorBlind.vision, 
                'cd2': this.model.dataPoints[0].targets.length, 
                'cd3': this.model.settings.targets.comparison,
                'cd6': this.model.settings.legend.show,
                'cd12': this.model.settings.general.orientation,
                'cd15': this.meta.dev
            });

            if (!this.licced) {
                this.licced = true;
                OKVizUtility.lic_log(this.meta, options, this.host);
            }

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
                        validValues: {
                            "minHeight": {
                                numberRange: {
                                    min: 0
                                }
                            },
                            "maxHeight": {
                                numberRange: {
                                    min: 0
                                }
                            }
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
                            for(let i = 0; i < Math.min(maxDataPoints, this.model.enumerationDataPoints.length); i++) {
                                let enumerateDataPoint = this.model.enumerationDataPoints[i];

                                if (enumerateDataPoint.showOnDemand) {
                                    objectEnumeration.push({
                                        objectName: objectName,
                                        displayName: enumerateDataPoint.displayName,
                                        properties: {
                                            "fill": {
                                                solid: {
                                                    color: enumerateDataPoint.color
                                                }
                                            }
                                        },
                                        selector: enumerateDataPoint.selectionId.getSelector()
                                    });
                                }
                            }
                        }
                    }

                    for(let i = 0; i < this.model.enumerationDataPoints.length; i++) {
                        let enumerateDataPoint = this.model.enumerationDataPoints[i];

                        if (!enumerateDataPoint.showOnDemand) {
                            objectEnumeration.push({
                                objectName: objectName,
                                displayName: enumerateDataPoint.displayName,
                                properties: {
                                    "fill": {
                                        solid: {
                                            color: enumerateDataPoint.color
                                        }
                                    }
                                },
                                selector: enumerateDataPoint.selectionId.getSelector()
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
                            "fontFamily": this.model.settings.label.fontFamily,
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
                            "fontFamily": this.model.settings.dataLabels.fontFamily,
                            "fontSize": this.model.settings.dataLabels.fontSize,
                            "unit": this.model.settings.dataLabels.unit,
                            "precision": this.model.settings.dataLabels.precision
                        },
                        validValues: {
                            "precision": {
                                numberRange: {
                                    min: 0,
                                    max: 15
                                }
                            }
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
                            "fontFamily": this.model.settings.axis.fontFamily,
                            "fontSize": this.model.settings.axis.fontSize,
                            "fill": this.model.settings.axis.fill,
                            "unit": this.model.settings.axis.unit,
                            "precision": this.model.settings.axis.precision
                        },
                        validValues: {
                            "precision": {
                                numberRange: {
                                    min: 0,
                                    max: 15
                                }
                            }
                        },
                        selector: null
                    });

                    break;
                
                case 'legend':
                    
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "show": this.model.settings.legend.show,
                            "position": this.model.settings.legend.position,
                            "showTitle": this.model.settings.legend.showTitle,
                            "titleText": this.model.settings.legend.titleText,
                            "labelColor": this.model.settings.legend.labelColor,
                            "fontSize": this.model.settings.legend.fontSize
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
                
                case 'about':
                    objectEnumeration.push({
                        objectName: objectName,
                        properties: {
                            "version": this.meta.version + (this.meta.dev ? ' BETA' : '')
                        },
                        selector: null
                    });
                    break;

            };

            return objectEnumeration;
        }

    }
}