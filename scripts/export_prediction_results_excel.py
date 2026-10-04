import os
import psycopg2
import pandas as pd
import numpy as np
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Define Output Paths
OUTPUT_DIR_1 = r"c:\Users\haris\OneDrive\Desktop\Final-Year-Project"
OUTPUT_DIR_2 = r"c:\Users\haris\OneDrive\Desktop\Final-Year-Project\urban-population-resource-optimization\frontend\public"
FILE_NAME = "Chennai_Urban_Optimization_Complete_Prediction_Results.xlsx"
OUT_PATH_1 = os.path.join(OUTPUT_DIR_1, FILE_NAME)
OUT_PATH_2 = os.path.join(OUTPUT_DIR_2, FILE_NAME)

print("Starting generation of Complete Prediction Results Excel Workbook...")

# 1. Fetch Data
try:
    conn = psycopg2.connect(dbname='smartcity_db', user='postgres', password='password', host='localhost', port=5432)
    query = """
        SELECT p.zone_id, z.zone_code, z.zone_name, p.year, p.population, 
               p.built_up_surface_m2, p.night_light, p.built_up_source, p.is_training_period
        FROM population_data p 
        JOIN urban_zone z ON p.zone_id = z.zone_id 
        ORDER BY p.zone_id, p.year;
    """
    df = pd.read_sql(query, conn)
    conn.close()
    print(f"Loaded {len(df)} rows from PostgreSQL smartcity_db.")
except Exception as e:
    print(f"PostgreSQL connection failed ({e}). Loading from processed CSV...")
    csv_path = r"c:\Users\haris\OneDrive\Desktop\Final-Year-Project\urban-population-resource-optimization\data\processed\chennai_preprocessed_2015_2030.csv"
    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.lower()
    zone_names = {
        1: "Thiruvottiyur", 2: "Manali", 3: "Madhavaram", 4: "Tondiarpet", 5: "Royapuram",
        6: "Thiru-Vi-Ka-Nagar", 7: "Ambattur", 8: "Annanagar", 9: "Teynampet", 10: "Kodambakkam",
        11: "Valasaravakkam", 12: "Alandur", 13: "Adyar", 14: "Perungudi", 15: "Sholinganallur"
    }
    df['zone_name'] = df['zone_id'].map(zone_names)

# Initialize openpyxl workbook
wb = openpyxl.Workbook()
# Remove default sheet
wb.remove(wb.active)

# Color Palette & Styles
navy_dark = "1B365D"
navy_light = "2B5B84"
slate_header = "334155"
sky_header = "0284C7"
emerald_header = "059669"
amber_header = "D97706"
light_gray = "F8FAFC"
alt_row_fill = "F1F5F9"
total_fill = "E2E8F0"

font_title = Font(name="Calibri", size=16, bold=True, color="1B365D")
font_subtitle = Font(name="Calibri", size=11, italic=True, color="475569")
font_section = Font(name="Calibri", size=13, bold=True, color="1B365D")
font_th = Font(name="Calibri", size=10, bold=True, color="FFFFFF")
font_td = Font(name="Calibri", size=10)
font_bold = Font(name="Calibri", size=10, bold=True)
font_total = Font(name="Calibri", size=10, bold=True, color="0F172A")

fill_navy = PatternFill(start_color=navy_dark, end_color=navy_dark, fill_type="solid")
fill_sky = PatternFill(start_color=sky_header, end_color=sky_header, fill_type="solid")
fill_emerald = PatternFill(start_color=emerald_header, end_color=emerald_header, fill_type="solid")
fill_amber = PatternFill(start_color=amber_header, end_color=amber_header, fill_type="solid")
fill_slate = PatternFill(start_color=slate_header, end_color=slate_header, fill_type="solid")
fill_alt = PatternFill(start_color=alt_row_fill, end_color=alt_row_fill, fill_type="solid")
fill_tot = PatternFill(start_color=total_fill, end_color=total_fill, fill_type="solid")

fill_high = PatternFill(start_color="FEE2E2", end_color="FEE2E2", fill_type="solid")
font_high = Font(name="Calibri", size=10, bold=True, color="991B1B")

fill_med = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid")
font_med = Font(name="Calibri", size=10, bold=True, color="92400E")

fill_low = PatternFill(start_color="DCFCE7", end_color="DCFCE7", fill_type="solid")
font_low = Font(name="Calibri", size=10, bold=True, color="166534")

thin_border_side = Side(border_style="thin", color="CBD5E1")
thin_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
double_bottom_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=Side(border_style="double", color="1B365D"))

align_center = Alignment(horizontal="center", vertical="center")
align_left = Alignment(horizontal="left", vertical="center")
align_right = Alignment(horizontal="right", vertical="center")
align_header = Alignment(horizontal="center", vertical="center", wrap_text=True)

# Helper function to auto-adjust column width
def autofit_columns(ws, min_width=12, padding=3):
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            # Skip title rows spanning multiple columns
            if cell.row < 4:
                continue
            val = cell.value
            if val is not None:
                # Format string lengths reasonably
                text = str(val)
                if len(text) > max_len:
                    max_len = len(text)
        ws.column_dimensions[col_letter].width = max(max_len + padding, min_width)


# ==============================================================================
# SHEET 1: EXECUTIVE SUMMARY & DASHBOARD
# ==============================================================================
ws1 = wb.create_sheet(title="Executive_Summary")
ws1.views.sheetView[0].showGridLines = True

ws1.append(["GREATER CHENNAI CORPORATION (GCC) - URBAN RESOURCE OPTIMIZATION"])
ws1.cell(1, 1).font = font_title
ws1.append(["Multi-Sector Forecasting & Civic Infrastructure Prediction Results (15 Zones, 2015–2030)"])
ws1.cell(2, 1).font = font_subtitle
ws1.append([])

ws1.append(["PROJECT & MODEL SPECIFICATIONS", "", "CIVIC INFRASTRUCTURE PLANNING STANDARDS", ""])
ws1.cell(4, 1).font = font_bold
ws1.cell(4, 3).font = font_bold
ws1.cell(4, 1).fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")
ws1.cell(4, 2).fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")
ws1.cell(4, 3).fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")
ws1.cell(4, 4).fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid")

specs = [
    ("Primary Machine Learning Architecture", "Hybrid PyTorch LSTM (Temporal) + XGBoost GBDT (Spatial Localizer)", "Domestic Municipal Water Standard", "135.00 Liters / Capita / Day (MoHUA / CPHEEO norm)"),
    ("Earth Observation Satellite Proxies", "GHSL Physical Built-Up Footprint + VIIRS Nighttime Radiance", "Urban Electric Power Benchmark", "3.50 kWh / Capita / Day (~1.28 MWh/person/yr CEA standard)"),
    ("Model Evaluation Performance (R² Score)", "0.9994 (Hybrid) vs 0.9985 (Pure LSTM) vs 1.0000 (Baseline)", "Healthcare Capacity Benchmark", "3.00 Hospital Beds / 1,000 residents (IPHS standard)"),
    ("Mean Absolute Percentage Error (MAPE)", "0.66% (Hybrid) vs 2.74% (Pure LSTM) — 75.9% Error Reduction", "Public Education Benchmark", "50.00 School Seats / 1,000 residents (RTE / UDPFI standard)"),
    ("Mean Absolute Error (MAE in Persons)", "4,337.70 Persons (Hybrid) vs 8,299.06 (Pure LSTM) — 47.7% Drop", "Civic Prioritization Formula", "Score = 0.40 * Growth + 0.35 * Density + 0.25 * Demand"),
    ("Dataset Geographic & Temporal Scope", "15 Corporation Zones, 16 Annual Epochs (2015 Observed to 2030 Predicted)", "Priority Action Thresholds", "HIGH (>=25.0) | MEDIUM (15.0 - 24.9) | LOW (<15.0)")
]

for row in specs:
    ws1.append(list(row))
    curr_row = ws1.max_row
    ws1.cell(curr_row, 1).font = font_bold
    ws1.cell(curr_row, 1).border = thin_border
    ws1.cell(curr_row, 2).font = font_td
    ws1.cell(curr_row, 2).border = thin_border
    ws1.cell(curr_row, 3).font = font_bold
    ws1.cell(curr_row, 3).border = thin_border
    ws1.cell(curr_row, 4).font = font_td
    ws1.cell(curr_row, 4).border = thin_border

ws1.append([])
ws1.append(["GREATER CHENNAI CORPORATION (15 ZONES AGGREGATE) - PREDICTION KPI HIGHLIGHTS"])
ws1.cell(12, 1).font = font_section

kpi_headers = ["Metric Description", "Baseline Epoch (2026)", "Predicted Horizon (2030)", "Net Incremental Growth", "Percentage Change (%)", "Key Strategic Implication"]
ws1.append(kpi_headers)
for col_idx in range(1, len(kpi_headers) + 1):
    c = ws1.cell(13, col_idx)
    c.font = font_th
    c.fill = fill_navy
    c.alignment = align_header
    c.border = thin_border

kpis = [
    ("Total Urban Population (Persons)", 8357784.19, 8469550.41, 111766.22, 1.34, "Additional 111,766 urban citizens requiring municipal services"),
    ("Daily Municipal Water Demand (MLD)", 1128.30, 1143.39, 15.09, 1.34, "Requires 15.09 MLD additional daily potable water supply capacity"),
    ("Daily Electric Power Demand (MWh/day)", 29252.24, 29643.43, 391.18, 1.34, "Requires 391.18 MWh/day extra substation grid transmission"),
    ("Public Hospital Beds Required (Count)", 25073, 25409, 336, 1.34, "Requires 336 additional hospital beds in municipal dispensaries"),
    ("Public School Seats Required (Count)", 417889, 423478, 5589, 1.34, "Requires 5,589 new primary and secondary classroom seats"),
    ("Total Physical Built-Up Footprint (km²)", 126.66, 127.04, 0.38, 0.30, "Satellite GHSL proxy confirms continued peri-urban consolidation"),
]

for idx, (metric, b26, p30, delta, pct, note) in enumerate(kpis):
    r_idx = 14 + idx
    ws1.append([metric, b26, p30, delta, pct / 100.0, note])
    ws1.cell(r_idx, 1).font = font_bold
    ws1.cell(r_idx, 1).border = thin_border
    
    c2 = ws1.cell(r_idx, 2)
    c2.font = font_td
    c2.number_format = "#,##0.00" if isinstance(b26, float) else "#,##0"
    c2.border = thin_border
    c2.alignment = align_right

    c3 = ws1.cell(r_idx, 3)
    c3.font = font_bold
    c3.number_format = "#,##0.00" if isinstance(p30, float) else "#,##0"
    c3.border = thin_border
    c3.alignment = align_right

    c4 = ws1.cell(r_idx, 4)
    c4.font = font_bold
    c4.number_format = "#,##0.00" if isinstance(delta, float) else "#,##0"
    c4.border = thin_border
    c4.alignment = align_right

    c5 = ws1.cell(r_idx, 5)
    c5.font = font_bold
    c5.number_format = "0.00%"
    c5.border = thin_border
    c5.alignment = align_right

    c6 = ws1.cell(r_idx, 6)
    c6.font = font_td
    c6.border = thin_border

autofit_columns(ws1, min_width=15)


# ==============================================================================
# SHEET 2: 2030 ZONE RANKINGS & PRIORITY ALLOCATION MATRIX
# ==============================================================================
ws2 = wb.create_sheet(title="Zone_Rankings_2030")
ws2.views.sheetView[0].showGridLines = True

ws2.append(["EXECUTIVE CIVIC RESOURCE ALLOCATION & VULNERABILITY RANKING (2030 FORECAST)"])
ws2.cell(1, 1).font = font_title
ws2.append(["Sorted by Priority Vulnerability Score (Growth 40% + Density 35% + Demand 25%)"])
ws2.cell(2, 1).font = font_subtitle
ws2.append([])

headers2 = [
    "Priority Rank", "Zone ID", "Zone Code", "Zone Name",
    "2026 Population", "2030 Predicted Population", "Net Population Addition", "Growth Rate (%)",
    "2030 Water Demand (MLD)", "2030 Power Demand (MWh/day)", "2030 Hospital Beds", "2030 School Seats",
    "Growth Factor (40%)", "Density Factor (35%)", "Demand Factor (25%)",
    "Priority Score", "Priority Level", "Recommended Municipal Intervention"
]
ws2.append(headers2)

for col_idx in range(1, len(headers2) + 1):
    c = ws2.cell(4, col_idx)
    c.font = font_th
    c.fill = fill_navy
    c.alignment = align_header
    c.border = thin_border
ws2.row_dimensions[4].height = 28

p26_df = df[df['year'] == 2026].set_index('zone_id')
p30_df = df[df['year'] == 2030].set_index('zone_id')

zone_rows = []
for zid in range(1, 16):
    pop26 = float(p26_df.loc[zid, 'population'])
    pop30 = float(p30_df.loc[zid, 'population'])
    zname = str(p26_df.loc[zid, 'zone_name'])
    zcode = str(p26_df.loc[zid, 'zone_code'])
    
    pop_delta = pop30 - pop26
    growth_pct = (pop_delta / pop26) * 100.0
    
    water_mld = (pop30 * 135.0) / 1e6
    water_lpd = pop30 * 135.0
    elec_mwh = (pop30 * 3.5) / 1e3
    beds = round(pop30 * 0.003)
    seats = round(pop30 * 0.05)
    
    growth_factor = max(0.0, growth_pct * 2.5)
    density_factor = (pop30 / 100000.0) * 5.0
    demand_factor = (water_lpd / 10000000.0) * 3.0
    
    score = round(growth_factor * 0.40 + density_factor * 0.35 + demand_factor * 0.25, 2)
    
    if score >= 25.0:
        level = "HIGH"
        action = "Immediate budgetary prioritization; expand trunk water mains & high-voltage grid"
    elif score >= 15.0:
        level = "MEDIUM"
        action = "Moderate infrastructure augmentation; planned healthcare and schooling expansion"
    else:
        level = "LOW"
        action = "Baseline regular maintenance; decentralized localized civic upgrades"
        
    zone_rows.append({
        'zid': zid, 'zcode': zcode, 'zname': zname,
        'pop26': pop26, 'pop30': pop30, 'pop_delta': pop_delta, 'growth_pct': growth_pct,
        'water_mld': water_mld, 'elec_mwh': elec_mwh, 'beds': beds, 'seats': seats,
        'growth_factor': growth_factor, 'density_factor': density_factor, 'demand_factor': demand_factor,
        'score': score, 'level': level, 'action': action
    })

# Sort descending by score
zone_rows.sort(key=lambda x: x['score'], reverse=True)

for rank_idx, z in enumerate(zone_rows, 1):
    r_idx = 4 + rank_idx
    row_data = [
        rank_idx, z['zid'], z['zcode'], z['zname'],
        z['pop26'], z['pop30'], z['pop_delta'], z['growth_pct'] / 100.0,
        z['water_mld'], z['elec_mwh'], z['beds'], z['seats'],
        round(z['growth_factor'], 2), round(z['density_factor'], 2), round(z['demand_factor'], 2),
        z['score'], z['level'], z['action']
    ]
    ws2.append(row_data)
    
    fill_to_use = fill_alt if rank_idx % 2 == 0 else PatternFill(fill_type=None)
    for c_idx in range(1, len(row_data) + 1):
        cell = ws2.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if fill_to_use.fill_type:
            cell.fill = fill_to_use
            
    # Formats
    ws2.cell(r_idx, 1).alignment = align_center
    ws2.cell(r_idx, 2).alignment = align_center
    ws2.cell(r_idx, 3).alignment = align_center
    ws2.cell(r_idx, 4).font = font_bold
    
    ws2.cell(r_idx, 5).number_format = "#,##0"
    ws2.cell(r_idx, 6).number_format = "#,##0"
    ws2.cell(r_idx, 6).font = font_bold
    ws2.cell(r_idx, 7).number_format = "#,##0"
    ws2.cell(r_idx, 8).number_format = "0.00%"
    
    ws2.cell(r_idx, 9).number_format = "#,##0.00"
    ws2.cell(r_idx, 10).number_format = "#,##0.00"
    ws2.cell(r_idx, 11).number_format = "#,##0"
    ws2.cell(r_idx, 12).number_format = "#,##0"
    
    ws2.cell(r_idx, 13).number_format = "0.00"
    ws2.cell(r_idx, 14).number_format = "0.00"
    ws2.cell(r_idx, 15).number_format = "0.00"
    
    score_cell = ws2.cell(r_idx, 16)
    score_cell.font = font_bold
    score_cell.number_format = "0.00"
    score_cell.alignment = align_right
    
    level_cell = ws2.cell(r_idx, 17)
    level_cell.alignment = align_center
    if z['level'] == "HIGH":
        level_cell.fill = fill_high
        level_cell.font = font_high
    elif z['level'] == "MEDIUM":
        level_cell.fill = fill_med
        level_cell.font = font_med
    else:
        level_cell.fill = fill_low
        level_cell.font = font_low

# Add Total Row
tot_row_idx = ws2.max_row + 1
ws2.append([
    "TOTAL", "-", "GCC", "Greater Chennai Corporation (15 Zones Sum / Avg)",
    f"=SUM(E5:E{tot_row_idx-1})", f"=SUM(F5:F{tot_row_idx-1})", f"=SUM(G5:G{tot_row_idx-1})", f"=AVERAGE(H5:H{tot_row_idx-1})",
    f"=SUM(I5:I{tot_row_idx-1})", f"=SUM(J5:J{tot_row_idx-1})", f"=SUM(K5:K{tot_row_idx-1})", f"=SUM(L5:L{tot_row_idx-1})",
    f"=AVERAGE(M5:M{tot_row_idx-1})", f"=AVERAGE(N5:N{tot_row_idx-1})", f"=AVERAGE(O5:O{tot_row_idx-1})",
    f"=AVERAGE(P5:P{tot_row_idx-1})", "OVERALL", "Comprehensive Municipal Master Plan Coordination"
])

for c_idx in range(1, len(headers2) + 1):
    c = ws2.cell(tot_row_idx, c_idx)
    c.font = font_total
    c.fill = fill_tot
    c.border = double_bottom_border

ws2.cell(tot_row_idx, 5).number_format = "#,##0"
ws2.cell(tot_row_idx, 6).number_format = "#,##0"
ws2.cell(tot_row_idx, 7).number_format = "#,##0"
ws2.cell(tot_row_idx, 8).number_format = "0.00%"
ws2.cell(tot_row_idx, 9).number_format = "#,##0.00"
ws2.cell(tot_row_idx, 10).number_format = "#,##0.00"
ws2.cell(tot_row_idx, 11).number_format = "#,##0"
ws2.cell(tot_row_idx, 12).number_format = "#,##0"
ws2.cell(tot_row_idx, 13).number_format = "0.00"
ws2.cell(tot_row_idx, 14).number_format = "0.00"
ws2.cell(tot_row_idx, 15).number_format = "0.00"
ws2.cell(tot_row_idx, 16).number_format = "0.00"

autofit_columns(ws2, min_width=11)
ws2.freeze_panes = "E5"


# ==============================================================================
# SHEET 3: COMPLETE TIMELINE (2015 - 2030) ALL 15 ZONES
# ==============================================================================
ws3 = wb.create_sheet(title="Complete_Timeline_2015_2030")
ws3.views.sheetView[0].showGridLines = True

ws3.append(["COMPLETE MULTI-TEMPORAL TIMELINE RECORDS: ALL 15 CHENNAI ZONES (2015–2030)"])
ws3.cell(1, 1).font = font_title
ws3.append(["Includes Historical Ground Truth (2015–2026) and Hybrid ML Model Predictions (2027–2030)"])
ws3.cell(2, 1).font = font_subtitle
ws3.append([])

headers3 = [
    "Zone ID", "Zone Code", "Zone Name", "Year", "Data Period",
    "Population (Persons)", "Built-Up Surface (m²)", "Built-Up Area (km²)",
    "Night-Light Radiance (VIIRS)", "Built-Up Provenance",
    "Daily Water Demand (MLD)", "Daily Electricity Demand (MWh)",
    "Hospital Beds Required", "School Seats Required"
]
ws3.append(headers3)

for col_idx in range(1, len(headers3) + 1):
    c = ws3.cell(4, col_idx)
    c.font = font_th
    c.fill = fill_slate
    c.alignment = align_header
    c.border = thin_border
ws3.row_dimensions[4].height = 26

for idx, r in df.iterrows():
    r_idx = 5 + idx
    yr = int(r['year'])
    pop = float(r['population'])
    bu_m2 = float(r['built_up_surface_m2'])
    bu_km2 = bu_m2 / 1e6
    nl = float(r['night_light']) if pd.notnull(r['night_light']) else 0.0
    period = "Historical Observed" if yr <= 2026 else "Hybrid ML Forecast"
    source = str(r['built_up_source']) if pd.notnull(r['built_up_source']) else ("Observed GHSL epoch" if yr in [2015, 2020, 2025, 2030] else "Linearly interpolated estimate")
    
    water_mld = (pop * 135.0) / 1e6
    elec_mwh = (pop * 3.5) / 1e3
    beds = round(pop * 0.003)
    seats = round(pop * 0.05)
    
    row_val = [
        int(r['zone_id']), str(r['zone_code']), str(r['zone_name']), yr, period,
        pop, bu_m2, bu_km2, nl, source,
        water_mld, elec_mwh, beds, seats
    ]
    ws3.append(row_val)
    
    is_forecast = (yr > 2026)
    row_fill = PatternFill(start_color="F0FDF4" if is_forecast else ("F8FAFC" if yr % 2 == 0 else "FFFFFF"), fill_type="solid")
    
    for c_idx in range(1, len(row_val) + 1):
        cell = ws3.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        cell.fill = row_fill
        
    ws3.cell(r_idx, 1).alignment = align_center
    ws3.cell(r_idx, 2).alignment = align_center
    ws3.cell(r_idx, 4).alignment = align_center
    ws3.cell(r_idx, 5).alignment = align_center
    
    if is_forecast:
        ws3.cell(r_idx, 5).font = Font(name="Calibri", size=10, bold=True, color="047857")
        
    ws3.cell(r_idx, 6).number_format = "#,##0"
    ws3.cell(r_idx, 7).number_format = "#,##0"
    ws3.cell(r_idx, 8).number_format = "#,##0.00"
    ws3.cell(r_idx, 9).number_format = "#,##0.00" if nl > 0 else "-"
    ws3.cell(r_idx, 11).number_format = "#,##0.00"
    ws3.cell(r_idx, 12).number_format = "#,##0.00"
    ws3.cell(r_idx, 13).number_format = "#,##0"
    ws3.cell(r_idx, 14).number_format = "#,##0"

autofit_columns(ws3, min_width=11)
ws3.freeze_panes = "F5"


# ==============================================================================
# SHEET 4: PREDICTION HORIZON (2027 - 2030) DETAILED ANNUAL TRAJECTORY
# ==============================================================================
ws4 = wb.create_sheet(title="Prediction_Horizon_2027_2030")
ws4.views.sheetView[0].showGridLines = True

ws4.append(["POST-PREDICTION ANNUAL TRAJECTORY (2027–2030 FORECAST HORIZON)"])
ws4.cell(1, 1).font = font_title
ws4.append(["Detailed Annual Population Forecasts Produced by Hybrid Machine Learning Pipeline"])
ws4.cell(2, 1).font = font_subtitle
ws4.append([])

headers4 = [
    "Zone ID", "Zone Code", "Zone Name",
    "2026 Baseline", "2027 Forecast", "2028 Forecast", "2029 Forecast", "2030 Forecast",
    "4-Year Net Increase", "Total Growth (%)", "Compound Annual Growth Rate (CAGR %)",
    "2030 Built-Up Area (km²)", "Annual Water Addition (MLD/yr)", "Annual Power Addition (MWh/yr)"
]
ws4.append(headers4)

for col_idx in range(1, len(headers4) + 1):
    c = ws4.cell(4, col_idx)
    c.font = font_th
    c.fill = fill_emerald
    c.alignment = align_header
    c.border = thin_border
ws4.row_dimensions[4].height = 26

for zid in range(1, 16):
    r_idx = 4 + zid
    zdf = df[df['zone_id'] == zid].set_index('year')
    p26 = float(zdf.loc[2026, 'population'])
    p27 = float(zdf.loc[2027, 'population'])
    p28 = float(zdf.loc[2028, 'population'])
    p29 = float(zdf.loc[2029, 'population'])
    p30 = float(zdf.loc[2030, 'population'])
    
    bu30 = float(zdf.loc[2030, 'built_up_surface_m2']) / 1e6
    zname = str(zdf.loc[2026, 'zone_name'])
    zcode = str(zdf.loc[2026, 'zone_code'])
    
    net_inc = p30 - p26
    pct_grow = (net_inc / p26) * 100.0
    cagr = ((p30 / p26) ** (1.0 / 4.0) - 1.0) * 100.0
    ann_water = ((p30 - p26) * 135.0 / 1e6) / 4.0
    ann_elec = ((p30 - p26) * 3.5 / 1e3) / 4.0
    
    row_val = [
        zid, zcode, zname,
        p26, p27, p28, p29, p30,
        net_inc, pct_grow / 100.0, cagr / 100.0,
        bu30, ann_water, ann_elec
    ]
    ws4.append(row_val)
    
    fill_to_use = fill_alt if zid % 2 == 0 else PatternFill(fill_type=None)
    for c_idx in range(1, len(row_val) + 1):
        cell = ws4.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if fill_to_use.fill_type:
            cell.fill = fill_to_use
            
    ws4.cell(r_idx, 1).alignment = align_center
    ws4.cell(r_idx, 2).alignment = align_center
    ws4.cell(r_idx, 3).font = font_bold
    
    for col_n in range(4, 9):
        ws4.cell(r_idx, col_n).number_format = "#,##0"
    ws4.cell(r_idx, 8).font = font_bold
    ws4.cell(r_idx, 9).number_format = "#,##0"
    ws4.cell(r_idx, 9).font = font_bold
    ws4.cell(r_idx, 10).number_format = "0.00%"
    ws4.cell(r_idx, 11).number_format = "0.00%"
    ws4.cell(r_idx, 12).number_format = "#,##0.00"
    ws4.cell(r_idx, 13).number_format = "#,##0.00"
    ws4.cell(r_idx, 14).number_format = "#,##0.00"

# Total row
tot_row4 = ws4.max_row + 1
ws4.append([
    "TOTAL", "-", "GCC Total",
    f"=SUM(D5:D{tot_row4-1})", f"=SUM(E5:E{tot_row4-1})", f"=SUM(F5:F{tot_row4-1})", f"=SUM(G5:G{tot_row4-1})", f"=SUM(H5:H{tot_row4-1})",
    f"=SUM(I5:I{tot_row4-1})", f"=AVERAGE(J5:J{tot_row4-1})", f"=AVERAGE(K5:K{tot_row4-1})",
    f"=SUM(L5:L{tot_row4-1})", f"=SUM(M5:M{tot_row4-1})", f"=SUM(N5:N{tot_row4-1})"
])

for c_idx in range(1, len(headers4) + 1):
    c = ws4.cell(tot_row4, c_idx)
    c.font = font_total
    c.fill = fill_tot
    c.border = double_bottom_border

for col_n in range(4, 9):
    ws4.cell(tot_row4, col_n).number_format = "#,##0"
ws4.cell(tot_row4, 9).number_format = "#,##0"
ws4.cell(tot_row4, 10).number_format = "0.00%"
ws4.cell(tot_row4, 11).number_format = "0.00%"
ws4.cell(tot_row4, 12).number_format = "#,##0.00"
ws4.cell(tot_row4, 13).number_format = "#,##0.00"
ws4.cell(tot_row4, 14).number_format = "#,##0.00"

autofit_columns(ws4, min_width=12)
ws4.freeze_panes = "D5"


# ==============================================================================
# SHEET 5: CIVIC RESOURCE ALLOCATION & SECTORAL ANALYSIS
# ==============================================================================
ws5 = wb.create_sheet(title="Civic_Resource_Demands")
ws5.views.sheetView[0].showGridLines = True

ws5.append(["CIVIC INFRASTRUCTURE DEMANDS & ALLOCATION REQUIREMENTS (2026 vs 2030)"])
ws5.cell(1, 1).font = font_title
ws5.append(["Comparative Infrastructure Sizing: Water, Power, Healthcare Beds, and School Classrooms"])
ws5.cell(2, 1).font = font_subtitle
ws5.append([])

headers5 = [
    "Zone ID", "Zone Code", "Zone Name",
    "2026 Water (MLD)", "2030 Water (MLD)", "Net Water Add (MLD)",
    "2026 Power (MWh)", "2030 Power (MWh)", "Net Power Add (MWh)",
    "2026 Beds (Count)", "2030 Beds (Count)", "Net New Beds",
    "2026 School Seats", "2030 School Seats", "Net New Seats"
]
ws5.append(headers5)

for col_idx in range(1, len(headers5) + 1):
    c = ws5.cell(4, col_idx)
    c.font = font_th
    c.fill = fill_sky
    c.alignment = align_header
    c.border = thin_border
ws5.row_dimensions[4].height = 26

for zid in range(1, 16):
    r_idx = 4 + zid
    zdf = df[df['zone_id'] == zid].set_index('year')
    p26 = float(zdf.loc[2026, 'population'])
    p30 = float(zdf.loc[2030, 'population'])
    zname = str(zdf.loc[2026, 'zone_name'])
    zcode = str(zdf.loc[2026, 'zone_code'])
    
    w26 = (p26 * 135.0) / 1e6
    w30 = (p30 * 135.0) / 1e6
    w_del = w30 - w26
    
    e26 = (p26 * 3.5) / 1e3
    e30 = (p30 * 3.5) / 1e3
    e_del = e30 - e26
    
    b26 = round(p26 * 0.003)
    b30 = round(p30 * 0.003)
    b_del = b30 - b26
    
    s26 = round(p26 * 0.05)
    s30 = round(p30 * 0.05)
    s_del = s30 - s26
    
    row_val = [
        zid, zcode, zname,
        w26, w30, w_del,
        e26, e30, e_del,
        b26, b30, b_del,
        s26, s30, s_del
    ]
    ws5.append(row_val)
    
    fill_to_use = fill_alt if zid % 2 == 0 else PatternFill(fill_type=None)
    for c_idx in range(1, len(row_val) + 1):
        cell = ws5.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if fill_to_use.fill_type:
            cell.fill = fill_to_use
            
    ws5.cell(r_idx, 1).alignment = align_center
    ws5.cell(r_idx, 2).alignment = align_center
    ws5.cell(r_idx, 3).font = font_bold
    
    for c_n in [4, 5, 6, 7, 8, 9]:
        ws5.cell(r_idx, c_n).number_format = "#,##0.00"
    for c_n in [10, 11, 12, 13, 14, 15]:
        ws5.cell(r_idx, c_n).number_format = "#,##0"

# Total row
tot_row5 = ws5.max_row + 1
ws5.append([
    "TOTAL", "-", "GCC Aggregate",
    f"=SUM(D5:D{tot_row5-1})", f"=SUM(E5:E{tot_row5-1})", f"=SUM(F5:F{tot_row5-1})",
    f"=SUM(G5:G{tot_row5-1})", f"=SUM(H5:H{tot_row5-1})", f"=SUM(I5:I{tot_row5-1})",
    f"=SUM(J5:J{tot_row5-1})", f"=SUM(K5:K{tot_row5-1})", f"=SUM(L5:L{tot_row5-1})",
    f"=SUM(M5:M{tot_row5-1})", f"=SUM(N5:N{tot_row5-1})", f"=SUM(O5:O{tot_row5-1})"
])

for c_idx in range(1, len(headers5) + 1):
    c = ws5.cell(tot_row5, c_idx)
    c.font = font_total
    c.fill = fill_tot
    c.border = double_bottom_border

for c_n in [4, 5, 6, 7, 8, 9]:
    ws5.cell(tot_row5, c_n).number_format = "#,##0.00"
for c_n in [10, 11, 12, 13, 14, 15]:
    ws5.cell(tot_row5, c_n).number_format = "#,##0"

autofit_columns(ws5, min_width=12)
ws5.freeze_panes = "D5"


# ==============================================================================
# SHEET 6: MODEL BENCHMARK & EVALUATION ACCURACY
# ==============================================================================
ws6 = wb.create_sheet(title="Model_Benchmark_Evaluation")
ws6.views.sheetView[0].showGridLines = True

ws6.append(["EMPIRICAL MACHINE LEARNING BENCHMARK & FEATURE IMPORTANCE METRICS"])
ws6.cell(1, 1).font = font_title
ws6.append(["Evaluated on Out-of-Sample Holdout Test Horizon (2025–2026, N=30 zone-years)"])
ws6.cell(2, 1).font = font_subtitle
ws6.append([])

ws6.append(["TABLE 1: MULTI-MODEL FORECASTING ACCURACY EVALUATION"])
ws6.cell(4, 1).font = font_section

headers6_1 = ["Performance Metric", "Baseline Linear Regressor", "PyTorch LSTM Sequential", "Hybrid (LSTM + XGBoost)", "Hybrid Gain vs LSTM (%)", "Evaluation Description"]
ws6.append(headers6_1)

for col_idx in range(1, len(headers6_1) + 1):
    c = ws6.cell(5, col_idx)
    c.font = font_th
    c.fill = fill_navy
    c.alignment = align_header
    c.border = thin_border
ws6.row_dimensions[5].height = 24

model_eval = [
    ("R² Score (Goodness of Fit)", 1.0000, 0.9985, 0.9994, 0.09, "Coefficient of determination; proportion of variance explained by model"),
    ("MAPE (% Error Rate)", 0.14, 2.74, 0.66, -75.91, "Mean Absolute Percentage Error; measures relative forecast deviation"),
    ("MAE (Mean Absolute Error)", 813.06, 8299.06, 4337.70, -47.73, "Mean magnitude of prediction error in absolute population count (persons)"),
    ("RMSE (Root Mean Squared Error)", 918.50, 10369.26, 6440.19, -37.89, "Standard deviation of residuals; penalizes large prediction outliers")
]

for idx, (metric, base, lstm, hyb, gain, desc) in enumerate(model_eval):
    r_idx = 6 + idx
    ws6.append([metric, base, lstm, hyb, gain / 100.0, desc])
    for c_idx in range(1, len(headers6_1) + 1):
        cell = ws6.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if idx % 2 == 1:
            cell.fill = fill_alt
            
    ws6.cell(r_idx, 1).font = font_bold
    if "R²" in metric:
        ws6.cell(r_idx, 2).number_format = "0.0000"
        ws6.cell(r_idx, 3).number_format = "0.0000"
        ws6.cell(r_idx, 4).number_format = "0.0000"
    elif "MAPE" in metric:
        ws6.cell(r_idx, 2).number_format = "0.00%"
        ws6.cell(r_idx, 3).number_format = "0.00%"
        ws6.cell(r_idx, 4).number_format = "0.00%"
    else:
        ws6.cell(r_idx, 2).number_format = "#,##0.00"
        ws6.cell(r_idx, 3).number_format = "#,##0.00"
        ws6.cell(r_idx, 4).number_format = "#,##0.00"
        
    ws6.cell(r_idx, 4).font = Font(name="Calibri", size=10, bold=True, color="0284C7")
    ws6.cell(r_idx, 5).font = Font(name="Calibri", size=10, bold=True, color="059669" if gain < 0 or "R²" in metric else "DC2626")
    ws6.cell(r_idx, 5).number_format = "0.00%"
    ws6.cell(r_idx, 5).alignment = align_right

ws6.append([])
ws6.append(["TABLE 2: XGBOOST SPATIAL LOCALIZER FEATURE IMPORTANCE WEIGHTS"])
ws6.cell(11, 1).font = font_section

headers6_2 = ["Feature Name", "Domain Category", "Feature Description", "Relative Gain Weight", "Cumulative Weight (%)"]
ws6.append(headers6_2)

for col_idx in range(1, len(headers6_2) + 1):
    c = ws6.cell(12, col_idx)
    c.font = font_th
    c.fill = fill_amber
    c.alignment = align_header
    c.border = thin_border
ws6.row_dimensions[12].height = 24

feats = [
    ("Projected Population (LSTM Sequence)", "Temporal", "Non-linear multi-step sequence projection generated by PyTorch recurrent network", 0.28, 0.28),
    ("Built-Up Surface Area (m²)", "Physical Proxy", "European Commission Global Human Settlement Layer (GHSL) impervious land footprint", 0.22, 0.50),
    ("Night-Light Radiance (VIIRS)", "Economic Proxy", "NOAA Visible Infrared Imaging Radiometer Suite nighttime lights luminosity", 0.16, 0.66),
    ("Year-over-Year Built-Up Change", "Urban Dynamics", "First-order temporal differential of physical built-up surface area growth", 0.12, 0.78),
    ("Year-over-Year Night-Light Change", "Urban Dynamics", "First-order temporal differential of economic nocturnal luminance change", 0.09, 0.87),
    ("Population Growth Rate (%)", "Demographic", "Zone historical demographic expansion rate between baseline epochs", 0.08, 0.95),
    ("Zone Spatial Coordinate (ID)", "Spatial Context", "Categorical spatial index embedding distinct municipal geographic coordinates", 0.05, 1.00)
]

for idx, (fname, cat, desc, wt, cum) in enumerate(feats):
    r_idx = 13 + idx
    ws6.append([fname, cat, desc, wt, cum])
    for c_idx in range(1, len(headers6_2) + 1):
        cell = ws6.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if idx % 2 == 1:
            cell.fill = fill_alt
            
    ws6.cell(r_idx, 1).font = font_bold
    ws6.cell(r_idx, 2).alignment = align_center
    ws6.cell(r_idx, 4).number_format = "0.0%"
    ws6.cell(r_idx, 4).alignment = align_right
    ws6.cell(r_idx, 4).font = font_bold
    ws6.cell(r_idx, 5).number_format = "0.0%"
    ws6.cell(r_idx, 5).alignment = align_right

# Total Feature row
tot_f_row = ws6.max_row + 1
ws6.append(["TOTAL ATTRIBUTION WEIGHT", "All Domains", "Sum of GBDT gain across all architectural feature inputs", f"=SUM(D13:D{tot_f_row-1})", "100.0%"])
for c_idx in range(1, len(headers6_2) + 1):
    c = ws6.cell(tot_f_row, c_idx)
    c.font = font_total
    c.fill = fill_tot
    c.border = double_bottom_border
ws6.cell(tot_f_row, 4).number_format = "0.0%"

autofit_columns(ws6, min_width=14)


# ==============================================================================
# SHEET 7: MATHEMATICAL FORMULAS & PLANNING STANDARDS
# ==============================================================================
ws7 = wb.create_sheet(title="Formulas_And_Methodology")
ws7.views.sheetView[0].showGridLines = True

ws7.append(["MATHEMATICAL FORMULATIONS & MUNICIPAL PLANNING NORMS REFERENCE"])
ws7.cell(1, 1).font = font_title
ws7.append(["Standardized Equations and Engineering Benchmarks Governed by MoHUA, CEA, IPHS, and RTE"])
ws7.cell(2, 1).font = font_subtitle
ws7.append([])

headers7 = ["Domain Category", "Planning Variable", "Governing Standard / Benchmark", "Mathematical Formulation", "Unit of Measure", "Engineering Rationale & Application"]
ws7.append(headers7)

for col_idx in range(1, len(headers7) + 1):
    c = ws7.cell(4, col_idx)
    c.font = font_th
    c.fill = fill_navy
    c.alignment = align_header
    c.border = thin_border
ws7.row_dimensions[4].height = 24

formulas_data = [
    ("Municipal Water Supply", "Potable Daily Demand (W)", "MoHUA / CPHEEO Indian Standard", "W_t = (P_t * 135) / 1,000,000", "ML/day (MLD)", "Standard urban per capita potable allowance covering domestic, sanitation, and hygiene needs"),
    ("Electric Grid Sizing", "Electric Power Demand (E)", "Central Electricity Authority (CEA)", "E_t = (P_t * 3.5) / 1,000", "MWh/day", "Average residential and commercial smart city power consumption factor"),
    ("Public Healthcare", "Hospital Beds Capacity (H)", "Indian Public Health Standards (IPHS)", "H_t = ROUND(P_t * 0.003)", "Beds (Count)", "Minimum baseline target of 3.0 secondary/tertiary hospital beds per 1,000 urban citizens"),
    ("Public Education", "School Seats Capacity (S)", "RTE Act & UDPFI Guidelines", "S_t = ROUND(P_t * 0.05)", "Seats (Count)", "Baseline requirement of 50 school classroom seats per 1,000 total resident population"),
    ("Civic Vulnerability", "Density Factor (DF)", "GCC Spatial Normalization", "DF = (P_2030 / 100,000) * 5.0", "Score Units", "Measures stress exerted on municipal civic services due to gross population concentration"),
    ("Civic Vulnerability", "Demand Factor (WF)", "GCC Hydrological Normalization", "WF = (Water_LPD / 10,000,000) * 3.0", "Score Units", "Quantifies absolute volume pressure exerted on localized water distribution networks"),
    ("Civic Vulnerability", "Growth Factor (GF)", "GCC Dynamic Expansion Rate", "GF = MAX(0.0, Growth_% * 2.5)", "Score Units", "Captures rapid demographic expansion acceleration requiring upfront capital deployment"),
    ("Civic Vulnerability", "Total Priority Score", "Multi-Criteria Decision Matrix", "Score = 0.40*GF + 0.35*DF + 0.25*WF", "Index (0–100)", "Aggregated composite index determining capital budget prioritization across the 15 zones"),
    ("Model Accuracy", "Mean Absolute Error (MAE)", "Statistical Metric", "MAE = (1/n) * SUM(|y_true - y_pred|)", "Persons", "Quantifies average absolute population forecast error across test horizon sample"),
    ("Model Accuracy", "Root Mean Squared Error (RMSE)", "Statistical Metric", "RMSE = SQRT((1/n) * SUM((y_true - y_pred)^2))", "Persons", "Heavily penalizes extreme forecast outliers in critical municipal planning predictions"),
    ("Model Accuracy", "Mean Absolute % Error (MAPE)", "Statistical Metric", "MAPE = (1/n) * SUM(|y_true - y_pred| / y_true) * 100", "% Error", "Standard scale-independent relative error metric comparing cross-zone prediction accuracy"),
    ("Model Accuracy", "Coefficient of Determination (R²)", "Statistical Metric", "R² = 1 - (SS_res / SS_tot)", "Ratio (0–1)", "Proportion of demographic variance explained by the multimodal hybrid architecture")
]

for idx, (cat, var, std, form, unit, rat) in enumerate(formulas_data):
    r_idx = 5 + idx
    ws7.append([cat, var, std, form, unit, rat])
    for c_idx in range(1, len(headers7) + 1):
        cell = ws7.cell(r_idx, c_idx)
        cell.font = font_td
        cell.border = thin_border
        if idx % 2 == 1:
            cell.fill = fill_alt
            
    ws7.cell(r_idx, 1).font = font_bold
    ws7.cell(r_idx, 2).font = font_bold
    ws7.cell(r_idx, 4).font = Font(name="Consolas", size=9, bold=True, color="1E293B")
    ws7.cell(r_idx, 5).alignment = align_center

autofit_columns(ws7, min_width=14)

# Save the workbook to both locations
os.makedirs(OUTPUT_DIR_1, exist_ok=True)
os.makedirs(OUTPUT_DIR_2, exist_ok=True)

wb.save(OUT_PATH_1)
print(f"Successfully saved Master Excel Workbook to: {OUT_PATH_1}")

wb.save(OUT_PATH_2)
print(f"Successfully saved Master Excel Workbook to: {OUT_PATH_2}")

print("Excel generation completed successfully!")
