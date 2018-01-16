import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../api/services/api.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
import { ViewLocation } from '../../../api/models/view-location';

@Component({
  selector: 'app-output-charts',
  templateUrl: './output-charts.component.html',
  styleUrls: ['./output-charts.component.scss']
})
export class OutputChartsComponent implements OnInit, AfterViewInit {

  constructor(private api: ApiService, private translate: TranslateService, private router: Router) { }

  public study;
  public symbol;
  public activePage = '';
  public activeBtn = '';

  public outputProductChartList;
  public outputProductChart;
  public tempRecordPts;
  public nbSteps;
  public NB_STEPS;
  public selectedEquip;
  public folderImg;
  public shape: number;
  public mesAxisX;
  public mesAxisY;
  public mesAxisZ;

  public rbpoint01;
  public rbpoint02;
  public rbpoint03;
  public radioChecked;

  public imgAxis = {
    axis1: '',
    axis2: '',
    axis3: ''
  };
  public imgPlan = {
    plan1: '',
    plan2: '',
    plan3: ''
  };

  public recordType: string;

  public imgProd3D;
  public radioDisable: boolean;
  public selectDisable: boolean;

  public headExchangeResult;
  public headExchangeCurve;

  public heatExchangeChartData;
  public heatExchangeChartOptions;
  public heatExchangeChartLegend = true;
  public heatExchangeChartType= 'line';
  public heatExchangeColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)'], }
  ];

  public selectedAxe: number;
  public productSectionResult;
  public productSectionValue;
  public productSectionRecAxis;
  public productSectionMesAxis;
  public productSectionAxisTemp;
  public axis1Disable: boolean;
  public axis3Disable: boolean;

  public timeBasedResult;
  public timeBasedCurve;
  public timeBasedLabel;

  public timeBasedChartData;
  public timeBasedChartOptions;
  public timeBasedChartLegend = true;
  public timeBasedChartType= 'line';
  public timeBasedColours: Array<any> = [
    { backgroundColor: ['rgb(0,0,255)', 'rgb(0,192,192)', 'rgb(0,255,255)', 'rgb(0,255,0)'], }
  ];

  @ViewChild(BaseChartDirective) heatExchangeChart: BaseChartDirective;

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
        dataEquip => {
          if (dataEquip == '') {
            swal('Oops..', 'This study has no product charts results.', 'error');
            this.router.navigate(['/output/preliminary']);
          } else {
            this.outputProductChartList = dataEquip;
            this.selectedEquip = dataEquip[0].ID_STUDY_EQUIPMENTS;
          }
        }
      );
      this.radioDisable = true;
      this.selectDisable = true;
      this.rbpoint01 = '';
      this.rbpoint02 = '';
      this.rbpoint03 = '';
      this.recordType = 'points';
      this.radioChecked = null;
      this.selectedAxe = 2;
      this.axis1Disable = false;
      this.axis3Disable = false;
    }
  }

  ngAfterViewInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
      this.api.getProductElmt(this.study.ID_STUDY).subscribe(
        data => {
          this.shape = data.SHAPECODE;
        }
      );
      this.refeshView();
    }
  }

  refeshView() {
    const showLoader = <HTMLElement>document.getElementById('showLoaderLocation');
    showLoader.style.display = 'block';
    this.api.getSymbol(this.study.ID_STUDY).subscribe(
      data => {
        this.symbol = data;
        console.log(this.symbol);
        this.activePage = 'location';
        this.loadData();
        this.api.getTempRecordPts(this.study.ID_STUDY).subscribe(
          dataTemp => {
            this.tempRecordPts = dataTemp;
            this.nbSteps = dataTemp.NB_STEPS;
          }
        );
        showLoader.style.display = 'none';
      }
    );
  }

  changeEquipment() {
    this.activeBtn = '';
    this.radioDisable = true;
    this.selectDisable = true;
    this.selectedAxe = 2;
    this.loadData();
  }

  loadData() {
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      dataEquip => {
        this.outputProductChartList = dataEquip;
        for (let i = 0; i < Object.keys(dataEquip).length; i++) {
          if (dataEquip[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = dataEquip[i];
          }
        }
        if (this.shape == 1) {
          this.folderImg = 'SLAB';
          this.axis1Disable = true;
          this.axis3Disable = true;
        } else if (this.shape == 2) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'STANDING_PLPD/parallel';
            this.axis1Disable = true;
          } else {
            this.folderImg = 'STANDING_PLPD/perpendicular';
            this.axis3Disable = true;
          }
        } else if (this.shape == 3) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_PLPD/parallel';
          } else {
            this.folderImg = 'LAYING_PLPD/perpendicular';
          }
          this.axis3Disable = true;
        } else if (this.shape == 4) {
          this.folderImg = 'STANDING_CYL';
          this.axis3Disable = true;
        } else if (this.shape == 5) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL/parallel';
          } else {
            this.folderImg = 'LAYING_CYL/perpendicular';
          }
          this.axis3Disable = true;
        } else if (this.shape == 6) {
          this.folderImg = 'SPHERE';
          this.axis1Disable = true;
          this.axis3Disable = true;
        } else if (this.shape == 7) {
          this.folderImg = 'STANDING_CYL_C';
          this.axis3Disable = true;
        } else if (this.shape == 8) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'LAYING_CYL_C/parallel';
          } else {
            this.folderImg = 'LAYING_CYL_C/perpendicular';
          }
          this.axis3Disable = true;
        } else if (this.shape == 9) {
          if (this.outputProductChart.ORIENTATION == 1) {
            this.folderImg = 'BREADED/parallel';
            this.axis1Disable = true;
          } else {
            this.folderImg = 'BREADED/perpendicular';
            this.axis3Disable = true;
          }
        }
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/shape.png';
      }
    );
  }

  selectPoints() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'points';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/points.png';
    this.rbpoint01 = this.translate.instant('Surface');
    this.rbpoint02 = this.translate.instant('Internal');
    this.rbpoint03 = this.translate.instant('Bottom');
    this.recordType = 'points';
  }

  selectAxis() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'axis';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/axes.png';
    if (this.shape == 1) {
      this.rbpoint01 = this.translate.instant('Axis 3');
      this.rbpoint02 = this.translate.instant('Axis 2');
      this.rbpoint03 = this.translate.instant('Axis 1');
    } else if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Axis 3');
        this.rbpoint02 = this.translate.instant('Axis 2');
        this.rbpoint03 = this.translate.instant('Axis 1');
      } else {
        this.rbpoint01 = this.translate.instant('Axis 1');
        this.rbpoint02 = this.translate.instant('Axis 2');
        this.rbpoint03 = this.translate.instant('Axis 3');
      }
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Axis 3');
        this.rbpoint02 = this.translate.instant('Axis 1');
        this.rbpoint03 = this.translate.instant('Axis 2');
      } else {
        this.rbpoint01 = this.translate.instant('Axis 2');
        this.rbpoint02 = this.translate.instant('Axis 1');
        this.rbpoint03 = this.translate.instant('Axis 3');
      }
    } else if (this.shape == 4 || this.shape == 5 || this.shape == 6) {
      this.rbpoint01 = this.translate.instant('Axis 1');
      this.rbpoint02 = this.translate.instant('Axis 2');
      this.rbpoint03 = this.translate.instant('Axis 3');
    } else if (this.shape == 7) {
      this.rbpoint01 = this.translate.instant('Axis 2');
      this.rbpoint02 = this.translate.instant('Axis 3');
      this.rbpoint03 = this.translate.instant('Axis 1');
    } else if (this.shape == 8) {
      this.rbpoint01 = this.translate.instant('Axis 2');
      this.rbpoint02 = this.translate.instant('Axis 1');
      this.rbpoint03 = this.translate.instant('Axis 3');
    }
    this.recordType = 'axis';
  }

  selectPlans() {
    this.mesAxisX = [];
    this.mesAxisY = [];
    this.mesAxisZ = [];
    this.activeBtn = 'plans';
    this.radioDisable = false;
    this.selectDisable = true;
    this.radioChecked = null;
    this.imgProd3D = 'assets/img/output/' + this.folderImg + '/plans.png';
    if (this.shape == 2 || this.shape == 9) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Slice 12');
        this.rbpoint02 = this.translate.instant('Slice 13');
        this.rbpoint03 = this.translate.instant('Slice 23');
      } else {
        this.rbpoint01 = this.translate.instant('Slice 23');
        this.rbpoint02 = this.translate.instant('Slice 13');
        this.rbpoint03 = this.translate.instant('Slice 12');
      }
    } else if (this.shape == 5 || this.shape == 7) {
      this.rbpoint01 = this.translate.instant('Slice 13');
      this.rbpoint02 = this.translate.instant('Slice 23');
      this.rbpoint03 = this.translate.instant('Slice 12');
    } else if (this.shape == 3) {
      if (this.outputProductChart.ORIENTATION == 1) {
        this.rbpoint01 = this.translate.instant('Slice 12');
        this.rbpoint02 = this.translate.instant('Slice 23');
        this.rbpoint03 = this.translate.instant('Slice 13');
      } else {
        this.rbpoint01 = this.translate.instant('Slice 13');
        this.rbpoint02 = this.translate.instant('Slice 23');
        this.rbpoint03 = this.translate.instant('Slice 12');
      }
    } else if (this.shape == 4 || this.shape == 8) {
      this.rbpoint01 = this.translate.instant('Slice 23');
      this.rbpoint02 = this.translate.instant('Slice 13');
      this.rbpoint03 = this.translate.instant('Slice 12');
    }
    this.recordType = 'plans';
  }

  onrbChange(recordType, value) {
    this.selectDisable = false;
    this.radioChecked = value;
    this.api.getMeshPoints(this.study.ID_STUDY).subscribe(
      data => {
        if (recordType === 'points') {
          this.mesAxisX = data[2];
          this.mesAxisY = data[1];
          this.mesAxisZ = data[0];
        }
        if (recordType === 'axis') {
          if (value === 0) {
            this.mesAxisX = [];
            this.mesAxisY = data[1];
            this.mesAxisZ = data[0];
          } else if (value === 1) {
            this.mesAxisX = data[2];
            this.mesAxisY = [];
            this.mesAxisZ = data[0];
          } else {
            this.mesAxisX = data[2];
            this.mesAxisY = data[1];
            this.mesAxisZ = [];
          }
        }
        if (recordType === 'plans') {
          if (value === 0) {
            this.mesAxisX = data[2];
            this.mesAxisY = [];
            this.mesAxisZ = [];
          } else if (value === 1) {
            this.mesAxisX = [];
            this.mesAxisY = data[1];
            this.mesAxisZ = [];
          } else {
            this.mesAxisX = [];
            this.mesAxisY = [];
            this.mesAxisZ = data[0];
          }
        }
      }
    );
    if (recordType === 'points') {
      if (value === 0) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_top.png';
      } else if (value === 1) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_int.png';
      } else {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/point_bot.png';
      }
    }
    if (recordType === 'axis') {
      if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.imgAxis.axis1 = 'axe3.png';
          this.imgAxis.axis2 = 'axe2.png';
          this.imgAxis.axis3 = 'axe1.png';
        }
      } else if (this.shape == 7 || this.shape == 8) {
        this.imgAxis.axis1 = 'axe2.png';
        this.imgAxis.axis2 = 'axe1.png';
        this.imgAxis.axis3 = 'axe3.png';
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.imgAxis.axis1 = 'axe3.png';
          this.imgAxis.axis2 = 'axe1.png';
          this.imgAxis.axis3 = 'axe2.png';
        } else {
          this.imgAxis.axis1 = 'axe2.png';
          this.imgAxis.axis2 = 'axe1.png';
          this.imgAxis.axis3 = 'axe3.png';
        }
      } else if (this.shape == 1) {
        this.imgAxis.axis1 = 'axe3.png';
        this.imgAxis.axis2 = 'axe2.png';
        this.imgAxis.axis3 = 'axe1.png';
      }
      if (value === 0) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis1;
        this.mesAxisX = [];
      } else if (value === 1) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis2;
      } else {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgAxis.axis3;
      }
    }
    if (recordType === 'plans') {
      if (this.shape == 2 || this.shape == 9) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.imgPlan.plan1 = 'plan12.png';
          this.imgPlan.plan2 = 'plan13.png';
          this.imgPlan.plan3 = 'plan23.png';
        } else {
          this.imgPlan.plan1 = 'plan23.png';
          this.imgPlan.plan2 = 'plan13.png';
          this.imgPlan.plan3 = 'plan12.png';
        }
      } else if (this.shape == 5 || this.shape == 7) {
        this.imgPlan.plan1 = 'plan13.png';
        this.imgPlan.plan2 = 'plan23.png';
        this.imgPlan.plan3 = 'plan12.png';
      } else if (this.shape == 8) {
        this.imgPlan.plan1 = 'plan23.png';
        this.imgPlan.plan2 = 'plan13.png';
        this.imgPlan.plan3 = 'plan12.png';
      } else if (this.shape == 3) {
        if (this.outputProductChart.ORIENTATION == 1) {
          this.imgPlan.plan1 = 'plan12.png';
          this.imgPlan.plan2 = 'plan23.png';
          this.imgPlan.plan3 = 'plan13.png';
        } else {
          this.imgPlan.plan1 = 'plan13.png';
          this.imgPlan.plan2 = 'plan23.png';
          this.imgPlan.plan3 = 'plan12.png';
        }
      } else if (this.shape == 4) {
        this.imgPlan.plan1 = 'plan23.png';
        this.imgPlan.plan2 = 'plan13.png';
        this.imgPlan.plan3 = 'plan12.png';
      }
      if (value === 0) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan1;
      } else if (value === 1) {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan2;
      } else {
        this.imgProd3D = 'assets/img/output/' + this.folderImg + '/' + this.imgPlan.plan3;
      }
    }
  }

  loadLocation() {
    this.activePage = 'location';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'block';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
    this.refeshView();
  }

  loadheadExchage() {
    this.activePage = 'heatExchange';
    const showLoader = <HTMLElement>document.getElementById('showLoader');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'block';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (data[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = data[i];
          }
        }
        showLoader.style.display = 'none';
        const params: ApiService.HeatExchangeParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.heatExchange(params).subscribe(
          dataChart => {
            this.headExchangeCurve = dataChart.curve;
            this.headExchangeResult = dataChart.result;
            const chartData = [
              {data: JSON.parse(JSON.stringify(this.headExchangeCurve)), label: this.translate.instant('Enthalpy'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2}
            ];
            this.heatExchangeChartData =  chartData;
            this.heatExchangeChartOptions = {
              animation: false,
              responsive: false,
              legend: {
                onClick: (e) => e.stopPropagation(),
                position: 'right',
                labels: {
                  padding: 20
                }
              },
              hoverMode: 'index',
              stacked: false,
              title: {
                  display: false,
                  text: this.outputProductChart.EQUIP_NAME,
                  fontColor: '#f00',
                  fontSize: 16
              },
              scales: {
                  xAxes: [{
                      type: 'linear',
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.enthalpySymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      },
                  }],
                  yAxes: [{
                      type: 'linear',
                      display: true,
                      id: 'y-axis-1',
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
          }
        );
      }
    );
  }

  loadProductSection() {
    this.activePage = 'productSection';
    const showLoader = <HTMLElement>document.getElementById('showLoaderProductSection');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'block';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'none';
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        showLoader.style.display = 'none';
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
      }
    );
  }

  loadTimeBased() {
    this.activePage = 'timeBased';
    const showLoader = <HTMLElement>document.getElementById('showLoaderTimeBased');
    showLoader.style.display = 'block';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'block';
    outlines2dPage.style.display = 'none';
    this.api.getstudyEquipmentProductChart(this.study.ID_STUDY).subscribe(
      data => {
        console.log(data);
        for (let i = 0; i < Object.keys(data).length; i++) {
          if (data[i].ID_STUDY_EQUIPMENTS == this.selectedEquip) {
            this.outputProductChart = data[i];
          }
        }
        const params: ApiService.TimeBasedParams = {
          idStudy: this.study.ID_STUDY,
          idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS']
        };
        this.api.timeBased(params).subscribe(
          dataTimeBased => {
            console.log(dataTimeBased);
            showLoader.style.display = 'none';
            this.timeBasedResult = dataTimeBased.result;
            this.timeBasedCurve = dataTimeBased.curve;
            this.timeBasedLabel = dataTimeBased.label;
            const chartDataObj =  this.timeBasedCurve;
            const chartData = [
              {data: JSON.parse(JSON.stringify(chartDataObj.top)), label: this.translate.instant('Top(' + this.timeBasedLabel.top + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,0,255)', backgroundColor: 'rgb(0,0,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.int)),
                      label: this.translate.instant('Internal(' + this.timeBasedLabel.int + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,192,192)', backgroundColor: 'rgb(0,192,192)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.bot)), label: this.translate.instant('Bottom(' + this.timeBasedLabel.bot + ')'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,255)', backgroundColor: 'rgb(0,255,255)', borderWidth: 2},
              {data: JSON.parse(JSON.stringify(chartDataObj.average)),
                      label: this.translate.instant('Average temperature'),
              type: 'line', radius: 0, fill: false, borderColor: 'rgb(0,255,0)', backgroundColor: 'rgb(0,255,0)', borderWidth: 2}
            ];
            this.timeBasedChartData =  chartData;
            console.log(this.timeBasedChartData);
            this.timeBasedChartOptions = {
              animation: false,
              responsive: false,
              legend: {
                onClick: (e) => e.stopPropagation(),
                position: 'right',
                labels: {
                  padding: 20
                }
              },
              hoverMode: 'index',
              stacked: false,
              title: {
                  display: false,
                  text: this.outputProductChart.EQUIP_NAME,
                  fontColor: '#f00',
                  fontSize: 16
              },
              scales: {
                  xAxes: [{
                      type: 'linear',
                      display: true,
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.temperatureSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      },
                  }],
                  yAxes: [{
                      type: 'linear',
                      display: true,
                      id: 'y-axis-1',
                      scaleLabel: {
                          display: true,
                          labelString: this.translate.instant(this.symbol.timeSymbol),
                          fontColor: '#f00',
                          fontSize: 20
                      }
                  }],
              }
            };
          }
        );
      }
    );
  }

  loadOutlines2d() {
    this.activePage = 'outlines2d';
    const locationPage = <HTMLElement>document.getElementById('location');
    const headExchangePage = <HTMLElement>document.getElementById('headExchange');
    const productSectionPage = <HTMLElement>document.getElementById('productSection');
    const timeBasedPage = <HTMLElement>document.getElementById('timeBased');
    const outlines2dPage = <HTMLElement>document.getElementById('outlines2d');
    locationPage.style.display = 'none';
    headExchangePage.style.display = 'none';
    productSectionPage.style.display = 'none';
    timeBasedPage.style.display = 'none';
    outlines2dPage.style.display = 'block';
  }

  changeAxePS() {
    console.log(this.selectedAxe);

    const showLoader = <HTMLElement>document.getElementById('showLoaderProductSection');
    showLoader.style.display = 'block';
    const params: ApiService.ProductSectionParams = {
      idStudy: this.study.ID_STUDY,
      idStudyEquipment: this.outputProductChart['ID_STUDY_EQUIPMENTS'],
      selectedAxe: this.selectedAxe
    };
    this.api.productSection(params).subscribe(
      data => {
        showLoader.style.display = 'none';
        this.productSectionResult = data.resultLabel;
        this.productSectionValue = data.result.resultValue;
        this.productSectionRecAxis = data.result.recAxis;
        this.productSectionMesAxis = data.result.mesAxis;
        if (this.selectedAxe == 1) {
          this.productSectionAxisTemp = '*,' + data.axeTemp[0] + ',' + data.axeTemp[1];
        } else if (this.selectedAxe == 2) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',*,' + data.axeTemp[1];
        } else if (this.selectedAxe == 3) {
          this.productSectionAxisTemp = data.axeTemp[0] + ',' + data.axeTemp[1] + ',*';
        }
      }
    );
  }

}
