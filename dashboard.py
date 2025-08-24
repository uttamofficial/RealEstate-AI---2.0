#!/usr/bin/env python3
"""
Streamlit Dashboard for Real Estate AI Investment System
Provides a web interface for the AI-powered real estate analysis
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
from datetime import datetime
import os

# Page configuration
st.set_page_config(
    page_title="Real Estate AI Investment System",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .property-card {
        background-color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #e0e0e0;
        margin: 0.5rem 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
</style>
""", unsafe_allow_html=True)

def load_analysis_data():
    """Load analysis data from JSON file"""
    try:
        if os.path.exists("real_estate_analysis.json"):
            with open("real_estate_analysis.json", "r") as f:
                return json.load(f)
        else:
            return None
    except Exception as e:
        st.error(f"Error loading data: {e}")
        return None

def create_summary_metrics(data):
    """Create summary metric cards"""
    if not data:
        return
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Properties",
            value=data['total_properties'],
            delta=None
        )
    
    with col2:
        st.metric(
            label="Best Cap Rate",
            value=f"{data['summary']['best_cap_rate']:.2f}%",
            delta=None
        )
    
    with col3:
        st.metric(
            label="Average Cap Rate",
            value=f"{data['summary']['average_cap_rate']:.2f}%",
            delta=None
        )
    
    with col4:
        st.metric(
            label="Total NOI",
            value=f"${data['summary']['total_noi']:,.0f}",
            delta=None
        )

def create_cap_rate_chart(data):
    """Create cap rate comparison chart"""
    if not data:
        return
    
    df = pd.DataFrame(data['analysis_results'])
    
    fig = px.bar(
        df,
        x='property_id',
        y='cap_rate',
        title="Cap Rate by Property",
        labels={'cap_rate': 'Cap Rate (%)', 'property_id': 'Property'},
        color='cap_rate',
        color_continuous_scale='viridis'
    )
    
    fig.update_layout(
        xaxis_title="Property ID",
        yaxis_title="Cap Rate (%)",
        showlegend=False
    )
    
    st.plotly_chart(fig, use_container_width=True)

def create_score_distribution(data):
    """Create investment score distribution chart"""
    if not data:
        return
    
    df = pd.DataFrame(data['analysis_results'])
    
    fig = px.histogram(
        df,
        x='score',
        nbins=10,
        title="Investment Score Distribution",
        labels={'score': 'Investment Score', 'count': 'Number of Properties'}
    )
    
    fig.update_layout(
        xaxis_title="Investment Score",
        yaxis_title="Number of Properties"
    )
    
    st.plotly_chart(fig, use_container_width=True)

def create_risk_analysis(data):
    """Create risk analysis visualization"""
    if not data:
        return
    
    risk_dist = data['summary']['risk_distribution']
    
    fig = go.Figure(data=[go.Pie(
        labels=list(risk_dist.keys()),
        values=list(risk_dist.values()),
        hole=0.3,
        marker_colors=['#00ff00', '#ffff00', '#ff0000']
    )])
    
    fig.update_layout(
        title="Risk Distribution",
        showlegend=True
    )
    
    st.plotly_chart(fig, use_container_width=True)

def create_property_table(data):
    """Create detailed property analysis table"""
    if not data:
        return
    
    df = pd.DataFrame(data['analysis_results'])
    
    # Format the dataframe for better display
    display_df = df.copy()
    display_df['cap_rate'] = display_df['cap_rate'].apply(lambda x: f"{x:.2f}%")
    display_df['score'] = display_df['score'].apply(lambda x: f"{x:.1f}/100")
    
    st.subheader("📊 Detailed Property Analysis")
    st.dataframe(
        display_df,
        use_container_width=True,
        hide_index=True
    )

def create_recommendations_section(data):
    """Create recommendations section"""
    if not data:
        return
    
    st.subheader("🎯 Investment Recommendations")
    
    # Sort by score (highest first)
    sorted_results = sorted(
        data['analysis_results'],
        key=lambda x: x['score'],
        reverse=True
    )
    
    for i, result in enumerate(sorted_results[:3]):  # Top 3 recommendations
        with st.container():
            col1, col2 = st.columns([1, 3])
            
            with col1:
                st.markdown(f"**#{i+1}**")
                st.markdown(f"**Score: {result['score']:.1f}/100**")
            
            with col2:
                st.markdown(f"**{result['property_id']}** - {result['recommendation']}")
                if 'ai_insights' in result and result['ai_insights']:
                    st.markdown(f"*{result['ai_insights']}*")

def main():
    # Header
    st.markdown('<h1 class="main-header">🏠 Real Estate AI Investment System</h1>', unsafe_allow_html=True)
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Dashboard", "Property Analysis", "AI Insights", "Data Export"]
    )
    
    # Load data
    data = load_analysis_data()
    
    if not data:
        st.warning("No analysis data found. Please run the AI engine first to generate data.")
        st.info("Run: `python real_estate_ai_engine.py` to generate analysis data.")
        return
    
    if page == "Dashboard":
        st.header("📈 Investment Dashboard")
        
        # Summary metrics
        create_summary_metrics(data)
        
        # Charts
        col1, col2 = st.columns(2)
        
        with col1:
            create_cap_rate_chart(data)
        
        with col2:
            create_score_distribution(data)
        
        # Risk analysis
        col1, col2 = st.columns(2)
        
        with col1:
            create_risk_analysis(data)
        
        with col2:
            st.subheader("📊 Market Position Analysis")
            df = pd.DataFrame(data['analysis_results'])
            market_pos_counts = df['market_position'].value_counts()
            
            fig = px.pie(
                values=market_pos_counts.values,
                names=market_pos_counts.index,
                title="Market Position Distribution"
            )
            st.plotly_chart(fig, use_container_width=True)
    
    elif page == "Property Analysis":
        st.header("🏠 Property Analysis")
        
        create_property_table(data)
        
        # Property details
        st.subheader("🔍 Property Details")
        selected_property = st.selectbox(
            "Select a property for detailed analysis:",
            [prop['property_id'] for prop in data['analysis_results']]
        )
        
        if selected_property:
            prop_data = next(
                prop for prop in data['analysis_results'] 
                if prop['property_id'] == selected_property
            )
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.metric("Investment Score", f"{prop_data['score']:.1f}/100")
                st.metric("Cap Rate", f"{prop_data['cap_rate']:.2f}%")
                st.metric("Risk Level", prop_data['risk_level'].title())
            
            with col2:
                st.metric("Market Position", prop_data['market_position'].title())
                st.metric("Rank", f"#{prop_data['rank']}")
                st.metric("NOI", f"${prop_data['noi']:,.2f}")
            
            st.markdown(f"**Recommendation:** {prop_data['recommendation']}")
            if 'ai_insights' in prop_data and prop_data['ai_insights']:
                st.markdown(f"**AI Insights:** {prop_data['ai_insights']}")
    
    elif page == "AI Insights":
        st.header("🤖 AI-Generated Insights")
        
        create_recommendations_section(data)
        
        # AI model performance
        st.subheader("📊 AI Analysis Summary")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric(
                "Average Investment Score",
                f"{data['summary']['average_score']:.1f}/100"
            )
            
            risk_dist = data['summary']['risk_distribution']
            st.metric(
                "Low Risk Properties",
                risk_dist['low']
            )
        
        with col2:
            st.metric(
                "Properties Analyzed",
                data['total_properties']
            )
            
            st.metric(
                "High Risk Properties",
                risk_dist['high']
            )
    
    elif page == "Data Export":
        st.header("📤 Data Export")
        
        st.subheader("Export Options")
        
        # JSON export
        if st.button("Download JSON Data"):
            json_str = json.dumps(data, indent=2)
            st.download_button(
                label="Download JSON",
                data=json_str,
                file_name=f"real_estate_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )
        
        # CSV export
        if st.button("Download CSV Data"):
            df = pd.DataFrame(data['analysis_results'])
            csv = df.to_csv(index=False)
            st.download_button(
                label="Download CSV",
                data=csv,
                file_name=f"real_estate_analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )
        
        # Data preview
        st.subheader("Data Preview")
        st.json(data)

if __name__ == "__main__":
    main()
