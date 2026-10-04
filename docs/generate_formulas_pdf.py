import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#475569"))

        # Header (Pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 755, "URBAN POPULATION FORECASTING & RESOURCE ALLOCATION SYSTEM")
            self.setFont("Helvetica", 8)
            self.drawRightString(558, 755, "MATHEMATICAL FORMULATIONS REFERENCE")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.75)
            self.line(54, 747, 558, 747)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.75)
        self.line(54, 45, 558, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 32, "Final Year Project | Greater Chennai Corporation Smart City Modeling")
        self.setFont("Helvetica-Bold", 8)
        self.drawRightString(558, 32, f"Page {self._pageNumber} of {page_count}")
        self.restoreState()

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#0284c7'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        spaceAfter=4
    )

    formula_box_style = ParagraphStyle(
        'FormulaText',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#0369a1')
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1e293b')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    story = []

    # Title Block
    story.append(Paragraph("Mathematical Models & Formulation Reference", title_style))
    story.append(Paragraph("Urban Population Forecasting & Resource Allocation System | Greater Chennai Corporation (15 Zones)", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284c7'), spaceAfter=12))

    # Introduction summary box
    intro_data = [[
        Paragraph(
            "<b>Document Overview:</b> This reference compiles the complete mathematical, machine learning, and municipal engineering formulations implemented across the data pipeline, time-series neural networks, spatial localizer, civic infrastructure demand models, and multi-criteria vulnerability priority scoring framework.",
            body_style
        )
    ]]
    intro_table = Table(intro_data, colWidths=[504])
    intro_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(intro_table)
    story.append(Spacer(1, 10))

    def make_formula_card(title, formula_str, explanation, vars_list=None):
        content = [
            Paragraph(f"<b>{title}</b>", h2_style),
            Spacer(1, 2)
        ]
        # Formula box
        f_data = [[Paragraph(formula_str, formula_box_style)]]
        f_table = Table(f_data, colWidths=[496])
        f_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f0f9ff')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#bae6fd')),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        content.append(f_table)
        content.append(Spacer(1, 3))
        content.append(Paragraph(f"<i>Description:</i> {explanation}", body_style))
        if vars_list:
            v_text = "<b>Parameters:</b> " + " | ".join(vars_list)
            content.append(Paragraph(v_text, ParagraphStyle('VarList', parent=body_style, fontSize=8, leading=11, textColor=colors.HexColor('#475569'))))
        content.append(Spacer(1, 8))
        return KeepTogether(content)

    # ==========================================
    # SECTION 1: PHYSICAL & DEMOGRAPHIC FEATURES
    # ==========================================
    story.append(Paragraph("1. Demographic & Earth Observation Feature Engineering", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#94a3b8'), spaceAfter=8))

    story.append(make_formula_card(
        "1.1 Temporal Linear Interpolation (Inter-Census & GHSL Epoch Alignment)",
        "y(t) = y(t1) + [ (t - t1) / (t2 - t1) ] * [ y(t2) - y(t1) ]",
        "Linearly bridges observational gaps between Global Human Settlement Layer (GHSL) satellite survey epochs.",
        ["t: Target estimation year", "t1, t2: Anchor sensor survey years", "y(t): Estimated built-up surface area"]
    ))

    story.append(make_formula_card(
        "1.2 Built-Up Surface Area Metric Conversion",
        "Built-Up Area (sq.km) = Built-Up Surface Area (sq.m) / 1,000,000",
        "Converts Copernicus GHSL raster pixel square-meter counts to standard municipal planning square-kilometer units."
    ))

    story.append(make_formula_card(
        "1.3 Annual Demographic Growth Rate",
        "growth_rate(t) = [ ( Population(t) - Population(t-1) ) / Population(t-1) ] * 100%",
        "Percentage demographic expansion calculated year-over-year.",
        ["Population(t): Zone population at year t", "Population(t-1): Population at previous year"]
    ))

    story.append(make_formula_card(
        "1.4 Dynamic Satellite Proxies (Built-Up & Night-Light Deltas)",
        "Delta_BuiltUp(t) = BuiltUp(t) - BuiltUp(t-1)  [sq.m / year]<br/>"
        "Delta_NightLight(t) = NightLight(t) - NightLight(t-1)  [nW / (cm^2 * sr)]",
        "Physical expansion differentials tracking structural urbanization and night-time radiometric radiance shifts."
    ))

    # ==========================================
    # SECTION 2: MACHINE LEARNING MODELS
    # ==========================================
    story.append(Paragraph("2. Machine Learning & Forecasting Model Architectures", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#94a3b8'), spaceAfter=8))

    story.append(make_formula_card(
        "2.1 Baseline Linear Regressor (Ordinary Least Squares)",
        "P_pred(t) = beta_0 + beta_1 * t<br/>"
        "where beta = ( X^T * X )^(-1) * X^T * y",
        "Serves as benchmark linear baseline extrapolating historical trends."
    ))

    story.append(make_formula_card(
        "2.2 Deep Long Short-Term Memory (LSTM) Cell Recurrence",
        "f_t = sigmoid( W_f * [h_{t-1}, x_t] + b_f )      [Forget Gate]<br/>"
        "i_t = sigmoid( W_i * [h_{t-1}, x_t] + b_i )      [Input Gate]<br/>"
        "C_cand_t = tanh( W_c * [h_{t-1}, x_t] + b_c )   [Candidate State]<br/>"
        "C_t = f_t * C_{t-1} + i_t * C_cand_t            [Cell Memory Update]<br/>"
        "o_t = sigmoid( W_o * [h_{t-1}, x_t] + b_o )      [Output Gate]<br/>"
        "h_t = o_t * tanh( C_t )                          [Hidden State Vector]",
        "PyTorch sequential neural network learning multi-year demographic momentum and memory vectors.",
        ["sigmoid(z) = 1 / (1 + exp(-z))", "tanh: Hyperbolic tangent", "h_t: Hidden state output vector"]
    ))

    story.append(make_formula_card(
        "2.3 Hybrid Machine Learning Pipeline (LSTM + XGBoost Spatial Calibration)",
        "P_Hybrid(t) = P_LSTM(t) + SUM_{m=1...M} f_m( z_t )<br/>"
        "z_t = [ P_LSTM(t), BuiltUp(t), NightLight(t), Delta_BuiltUp, Delta_NightLight, GrowthRate, Zone_ID ]<br/>"
        "Objective: L = SUM ( y_i - y_pred_i )^2 + SUM [ gamma * T_m + 0.5 * lambda * ||w_m||^2 ]",
        "Combines temporal sequence prediction with gradient boosted regression trees to account for spatial satellite proxies.",
        ["M: Number of boosted trees", "T_m: Leaf count", "gamma, lambda: Complexity and L2 penalties"]
    ))

    # ==========================================
    # SECTION 3: MODEL EVALUATION METRICS
    # ==========================================
    story.append(Paragraph("3. Statistical Model Performance Evaluation Metrics", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#94a3b8'), spaceAfter=8))

    eval_table_data = [
        [Paragraph("Metric", table_header), Paragraph("Mathematical Formulation", table_header), Paragraph("Benchmark Value (Hybrid)", table_header)],
        [
            Paragraph("<b>Mean Absolute Error (MAE)</b>", table_cell),
            Paragraph("MAE = ( 1 / N ) * SUM | y_i - y_pred_i |", table_cell),
            Paragraph("<b>4,337.70 persons</b><br/>(47.7% reduction vs LSTM)", table_cell)
        ],
        [
            Paragraph("<b>Root Mean Squared Error (RMSE)</b>", table_cell),
            Paragraph("RMSE = SQRT [ ( 1 / N ) * SUM ( y_i - y_pred_i )^2 ]", table_cell),
            Paragraph("<b>6,440.19 persons</b>", table_cell)
        ],
        [
            Paragraph("<b>Mean Absolute % Error (MAPE)</b>", table_cell),
            Paragraph("MAPE = ( 100% / N ) * SUM | ( y_i - y_pred_i ) / y_i |", table_cell),
            Paragraph("<b>0.66%</b>", table_cell)
        ],
        [
            Paragraph("<b>Coefficient of Determination (R^2)</b>", table_cell),
            Paragraph("R^2 = 1 - [ SUM( y_i - y_pred_i )^2 / SUM( y_i - y_mean )^2 ]", table_cell),
            Paragraph("<b>0.9994</b> (99.94% variance explained)", table_cell)
        ]
    ]
    eval_table = Table(eval_table_data, colWidths=[120, 234, 150])
    eval_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(eval_table)
    story.append(Spacer(1, 10))

    # ==========================================
    # SECTION 4: CIVIC RESOURCE DEMAND MODELS
    # ==========================================
    story.append(Paragraph("4. Municipal Civic Resource Demand Forecasting", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#94a3b8'), spaceAfter=8))

    story.append(make_formula_card(
        "4.1 Municipal Potable Water Demand (CPHEEO Guideline)",
        "Water Demand (LPD) = Population_z * 135.0  [Liters / Person / Day]<br/>"
        "Water Demand (MLD) = [ Population_z * 135.0 ] / 1,000,000  [Million Liters / Day]",
        "Derived from Indian Central Public Health and Environmental Engineering Organisation (CPHEEO) standard for metropolitan cities with piped sewerage.",
        ["Population_z: Projected Population in Zone z", "1 MLD = 1,000,000 Liters/day"]
    ))

    story.append(make_formula_card(
        "4.2 Electric Power Grid Consumption Demand (CEA Standard)",
        "Power Demand (kWh/day) = Population_z * 3.5  [kWh / Person / Day]<br/>"
        "Grid Energy Demand (MWh/day) = [ Population_z * 3.5 ] / 1,000  [MegaWatt-Hours / Day]",
        "Based on Central Electricity Authority (CEA) per-capita urban domestic and commercial consumption parameters.",
        ["1 MWh = 1,000 kWh"]
    ))

    story.append(make_formula_card(
        "4.3 Civic Social Infrastructure: Healthcare Capacity (WHO Standard)",
        "Hospital Beds Required = Population_z * 0.003 = [ Population_z * 3 ] / 1,000",
        "World Health Organization (WHO) municipal benchmark of 3 acute hospital beds per 1,000 residents."
    ))

    story.append(make_formula_card(
        "4.4 Civic Social Infrastructure: Education Capacity (UDPFI Guideline)",
        "School Seats Required = Population_z * 0.050 = [ Population_z * 50 ] / 1,000",
        "Urban Development Plans Formulation and Implementation (UDPFI) benchmark of 50 school seats per 1,000 residents for basic cohort schooling."
    ))

    # ==========================================
    # SECTION 5: MULTI-CRITERIA PRIORITY SCORE
    # ==========================================
    story.append(Paragraph("5. Multi-Criteria Priority Vulnerability Score Decomposition", h1_style))
    story.append(HRFlowable(width="100%", thickness=0.75, color=colors.HexColor('#94a3b8'), spaceAfter=8))

    story.append(make_formula_card(
        "5.1 Component Factor Definitions",
        "1. Demographic Growth Factor:  G_z = max( 0.0,  growth_rate_% * 2.5 )<br/>"
        "2. Built-Up Density Factor:    D_z = ( Population_z / 100,000 ) * 5.0<br/>"
        "3. Resource Demand Factor:     R_z = ( WaterDemand_LPD / 10,000,000 ) * 3.0",
        "Dimensionless indicators capturing demographic surge, physical spatial crowding, and utility load deficits."
    ))

    story.append(make_formula_card(
        "5.2 Composite Priority Vulnerability Index (MCVI)",
        "Priority Score (V_z) = ( 0.40 * G_z ) + ( 0.35 * D_z ) + ( 0.25 * R_z )<br/>"
        "V_z = Growth_Contribution + Density_Contribution + Demand_Contribution",
        "Weighted multi-criteria decision analysis prioritizing municipal budget allocation.",
        ["w_g = 0.40 (Growth)", "w_d = 0.35 (Built-Up Density)", "w_r = 0.25 (Utility Demand)"]
    ))

    # Priority Tier Table
    tier_table_data = [
        [Paragraph("Score Range (V_z)", table_header), Paragraph("Priority Tier", table_header), Paragraph("Municipal Policy Directive", table_header)],
        [
            Paragraph("<b>V_z &gt;= 35.0</b>", table_cell),
            Paragraph("<font color='#dc2626'><b>CRITICAL</b></font>", table_cell),
            Paragraph("Immediate multi-agency emergency infrastructure capital allocation mandated before 2030 horizon.", table_cell)
        ],
        [
            Paragraph("<b>25.0 &lt;= V_z &lt; 35.0</b>", table_cell),
            Paragraph("<font color='#ea580c'><b>HIGH</b></font>", table_cell),
            Paragraph("Top priority for trunk water main & substation capacity augmentation in next budgetary cycle.", table_cell)
        ],
        [
            Paragraph("<b>15.0 &lt;= V_z &lt; 25.0</b>", table_cell),
            Paragraph("<font color='#0284c7'><b>MEDIUM</b></font>", table_cell),
            Paragraph("Monitored capacity growth; routine phased civic infrastructure upgrades.", table_cell)
        ],
        [
            Paragraph("<b>V_z &lt; 15.0</b>", table_cell),
            Paragraph("<font color='#16a34a'><b>LOW</b></font>", table_cell),
            Paragraph("Adequately provisioned; standard municipal maintenance schedule.", table_cell)
        ]
    ]
    tier_table = Table(tier_table_data, colWidths=[110, 94, 300])
    tier_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#cbd5e1')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(tier_table)
    story.append(Spacer(1, 15))

    # Build the document using the NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] Generated PDF: {filename}")

if __name__ == '__main__':
    target_path = sys.argv[1] if len(sys.argv) > 1 else 'Project_Formulas_Reference.pdf'
    build_pdf(target_path)
