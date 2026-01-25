import { Component, OnInit, ChangeDetectorRef   } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup  } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, 
            ReactiveFormsModule, 
            FormsModule,
            MatFormFieldModule,
            MatSelectModule
          ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})


export class DashboardComponent implements OnInit {
constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}
  filterForm!: FormGroup;


  insights: any[] = [];
totalCount = 0;
totalPages = 0;

// summary counts
totalInsights = 0;
uniqueSectors = 0;
uniqueTopics = 0;
uniqueRegions = 0;
currentPage = 1;
pageSize = 9;
// Filters
selectedEndYear: string = '';
selectedTopic: string = '';
selectedSector: string = '';
selectedRegion: string = '';
selectedPestle: string = '';
selectedSource: string = '';
selectedCountry: string = '';


// Dropdown options
endYears: number[] = [];
topics: string[] = [];
sectors: string[] = [];
regions: string[] = [];
pestles: string[] = [];
sources: string[] = [];
countries: string[] = [];

ngOnInit() {
  this.filterForm = this.fb.group({
    topic: [''],
    sector: [''],
    region: [''],
    country: [''],
    pestle: [''],
    source: [''],
    end_year: ['']
  });
  this.loadInsights();
   this.loadFilters();
}

private getSectorChartData(insights: any[]) {
  const sectorMap = new Map<string, number>();

  insights.forEach(item => {
    const sector = item.sector && item.sector.trim() ? item.sector : 'Unknown';
    sectorMap.set(sector, (sectorMap.get(sector) || 0) + 1);
  });

  return Array.from(sectorMap.entries()).map(([sector, count]) => ({
    sector,
    count
  }));
}

renderSectorChart(data: { sector: string; count: number }[]) {
  // Clear old chart
  d3.select('#sectorChart').selectAll('*').remove();
  const tooltip = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('background', '#fff')
  .style('border', '1px solid #ccc')
  .style('padding', '6px 10px')
  .style('border-radius', '4px')
  .style('font-size', '12px')
  .style('pointer-events', 'none')
  .style('opacity', 0);

  const container = document.getElementById('sectorChart')!;
  const width = container.clientWidth;
  const height = 320;
  const margin = { top: 30, right: 30, bottom: 80, left: 60 };

  const svg = d3
    .select('#sectorChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const x = d3
    .scaleBand()
    .domain(data.map(d => d.sector))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // X Axis
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-30)')
    .style('text-anchor', 'end');
  // X-axis label
  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Sector');

  // Y Axis
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));
  // Y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Number of Insights');
    
  const maxCount = d3.max(data, d => d.count)!;

  const colorScale = d3
    .scaleLinear<string>()
    .domain([0, maxCount])
    .range(['#c89f9fbf', '#8c4a3c']); // light green → dark green

  
  const bars = svg
  .selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', d => x(d.sector)!)
  .attr('width', x.bandwidth())
  .attr('y', height - margin.bottom) // start from bottom
  .attr('height', 0)
  .attr('fill', d => colorScale(d.count))

  //  EVENTS FIRST (IMPORTANT)
  .on('mouseover', (event: MouseEvent, d) => {
    tooltip
      .style('opacity', 1)
      .html(
        `<strong>Sector:</strong> ${d.sector}<br/>
         <strong>Count:</strong> ${d.count}`
      );
  })
  .on('mousemove', (event: MouseEvent) => {
    tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px');
  })
  .on('mouseout', () => {
    tooltip.style('opacity', 0);
  });

//  ANIMATION SEPARATELY
bars
  .transition()
  .duration(800)
  .ease(d3.easeCubicOut)
  .attr('y', d => y(d.count))
  .attr('height', d => height - margin.bottom - y(d.count));


  // Color Legend 
const legendWidth = 200;
const legendHeight = 10;

const legendSvg = svg
  .append('g')
  .attr(
    'transform',
    `translate(${width - legendWidth - 20}, ${margin.top})`
  );

// Gradient definition
const defs = legendSvg.append('defs');

const linearGradient = defs
  .append('linearGradient')
  .attr('id', 'sector-gradient');

linearGradient
  .append('stop')
  .attr('offset', '0%')
  .attr('stop-color', '#c89f9fbf');

linearGradient
  .append('stop')
  .attr('offset', '100%')
  .attr('stop-color', '#8c4a3c');

// Gradient bar
legendSvg
  .append('rect')
  .attr('width', legendWidth)
  .attr('height', legendHeight)
  .style('fill', 'url(#sector-gradient)');

// Legend scale
const legendScale = d3
  .scaleLinear()
  .domain([0, maxCount])
  .range([0, legendWidth]);

const legendAxis = d3.axisBottom(legendScale).ticks(4);

// Axis
legendSvg
  .append('g')
  .attr('transform', `translate(0, ${legendHeight})`)
  .call(legendAxis);

// Legend title
legendSvg
  .append('text')
  .attr('x', 0)
  .attr('y', -5)
  .style('font-size', '12px')
  .style('font-weight', 'bold')
  .text('Insight Count');


}



prepareIntensityChartData() {
  const yearMap = new Map<number, number[]>();

  this.insights.forEach(item => {
    const year = Number(item.end_year);
    const intensity = Number(item.intensity);

    if (year && intensity) {
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(intensity);
    }
  });

  return Array.from(yearMap.entries())
    .map(([year, values]) => ({
      year,
      avgIntensity:
        values.reduce((a, b) => a + b, 0) / values.length
    }))
    .sort((a, b) => a.year - b.year);
}

renderIntensityChart(data: { year: number; avgIntensity: number }[]) {
  // Clear old chart (important for reload / filter)
  d3.select('#intensityChart').selectAll('*').remove();
const tooltip = d3
  .select('body')
  .append('div')
  .style('position', 'absolute')
  .style('background', '#333')
  .style('color', '#fff')
  .style('padding', '6px 10px')
  .style('border-radius', '4px')
  .style('font-size', '12px')
  .style('pointer-events', 'none')
  .style('opacity', 0);

   const margin = { top: 30, right: 30, bottom: 50, left: 60 };
  const container = document.getElementById('intensityChart')!;
  const width = container.clientWidth;
  const height = 320;

  const svg = d3
    .select('#intensityChart')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const x = d3
    .scaleBand()
    .domain(data.map(d => d.year.toString()))
    .range([margin.left, width - margin.right])
    .padding(0.3);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.avgIntensity)!])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // X Axis
  svg
    .append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));
  // X-axis label
svg
  .append('text')
  .attr('x', width / 2)
  .attr('y', height - 10)
  .attr('text-anchor', 'middle')
  .style('font-size', '14px')
  .style('font-weight', 'bold')
  .text('End Year');
  // Y Axis
  svg
    .append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y));

  // Y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .style('font-weight', 'bold')
    .text('Average Intensity');

    // Line generator
const line = d3
  .line<{ year: number; avgIntensity: number }>()
  .x(d => x(d.year.toString())! + x.bandwidth() / 2)
  .y(d => y(d.avgIntensity))
  .curve(d3.curveMonotoneX);
  // Legend group
const legend = svg
  .append('g')
  .attr('transform', `translate(${width - 180}, ${margin.top})`);
  legend
  .append('rect')
  .attr('width', 14)
  .attr('height', 14)
  .attr('fill', '#8c4a3c');
legend
  .append('text')
  .attr('x', 22)
  .attr('y', 12)
  .style('font-size', '13px')
  .style('font-weight', '500')
  .text('Avg Intensity Trend');

svg
  .append('path')
  .datum(data)
  .attr('fill', 'none')
  .attr('stroke', '#8c4a3c')
  .attr('stroke-width', 3)
  .attr('d', line);
svg
  .selectAll('.dot')
  .data(data)
  .enter()
  .append('circle')
  .attr('class', 'dot')
  .attr('cx', d => x(d.year.toString())! + x.bandwidth() / 2)
  .attr('cy', d => y(d.avgIntensity))
  .attr('r', 5)
  .attr('fill', '#8c4a3c')
  .on('mouseover', (event: MouseEvent, d: { year: number; avgIntensity: number }) => {
    tooltip
      .style('opacity', 1)
      .html(
        `<strong>Year:</strong> ${d.year}<br/>
         <strong>Avg Intensity:</strong> ${d.avgIntensity}`
      );
  })
  .on('mousemove', (event: MouseEvent) => {
    tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 28 + 'px');
  })
  .on('mouseout', () => {
    tooltip.style('opacity', 0);
  });

 
   
}

loadInsights(filters: any = {}) {
  this.dashboardService
    .getInsights(this.currentPage, this.pageSize, filters)
    .subscribe(res => {
      this.insights = res.data;
      this.totalCount = res.totalCount;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      const chartData = this.prepareIntensityChartData();
      this.renderIntensityChart(chartData);
      const sectorData = this.getSectorChartData(this.insights);
      this.renderSectorChart(sectorData);
    });
}

buildFilters() {
  const filters: any = {};

  Object.entries(this.filterForm.value).forEach(([key, value]) => {
    if (value !== null && value !== '' && value !== undefined) {
      filters[key] = value;
    }
  });

  return filters;
}

loadFilters() {
  this.dashboardService.getFilters().subscribe({
    next: (data) => {
      this.topics = data.topics;
      this.sectors = data.sectors;
      this.regions = data.regions;
      this.countries = data.countries;
      this.pestles = data.pestles;
      this.sources = data.sources;
      this.endYears = data.endYears;
      this.cdr.detectChanges();
    },
    error: err => console.error("Filters error", err)
  });
}
nextPage() {
  this.currentPage++;
  this.loadInsights();
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.loadInsights();
  }
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


hasActiveFilters(): boolean {
  const v = this.filterForm.value;
  return Object.values(v).some(
    value => value !== null && value !== ''
  );
}


onFilterChange() {
  if (!this.hasActiveFilters()) {
    return;
  }
  const filters = this.buildFilters();
  this.currentPage = 1;
  this.loadInsights(filters);
}

onTopicChange(value: string) {
  this.selectedCountry = value;   // force update
  this.currentPage = 1;         // reset pagination
  this.loadInsights();          // API call
}


resetFilters() {
//   this.filterForm.reset(
//     {
//       topic: '',
//       sector: '',
//       region: '',
//       country: '',
//       pestle: '',
//       source: '',
//       end_year: ''
//     },
//     { emitEvent: false }   // CRITICAL LINE
//   );

//   this.currentPage = 1;
// const filters: any = {};
//   // Load unfiltered data explicitly
//   this.loadInsights(filters);
  window.location.reload();
}



}
