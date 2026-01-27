import pandas as pd

# Paths based on your file structure
DEMO_PATH = 'data/DEMO_J.XPT'
DIET_PATH = 'data/DR1TOT_J.xpt'
FERRITIN_PATH = 'data/FERTIN_J.XPT'
VITD_PATH = 'data/VID_J.XPT'
BODY_MEASURE_PATH = 'data/BMX_J (1).xpt'

def merge_nhanes_data():
    try:
        print("Step 1: Reading NHANES files...")
        # Demographics
        demo = pd.read_sas(DEMO_PATH)[['SEQN', 'RIDAGEYR', 'RIAGENDR']]
        
        # Dietary: Adding Protein (DR1TPROT) and Zinc (DR1TZINC)
        diet_cols = ['SEQN', 'DR1TIRON', 'DR1TVD', 'DR1TPROT', 'DR1TZINC']
        diet = pd.read_sas(DIET_PATH)[diet_cols]
        
        # Body Measures: Adding BMI (BMXBMI) and MUAC (BMXARMC)
        body = pd.read_sas(BODY_MEASURE_PATH)[['SEQN', 'BMXBMI', 'BMXARMC']]
        
        # Laboratory Biomarkers (Ground Truth)
        iron_lab = pd.read_sas(FERRITIN_PATH)[['SEQN', 'LBDFERSI']]
        vitd_lab = pd.read_sas(VITD_PATH)[['SEQN', 'LBXVIDMS']]

        print("Merging all datasets on SEQN...")
        merged = pd.merge(demo, diet, on='SEQN', how='inner')
        merged = pd.merge(merged, iron_lab, on='SEQN', how='inner')
        merged = pd.merge(merged, vitd_lab, on='SEQN', how='inner')
        merged = pd.merge(merged, body, on='SEQN', how='inner')

        # Drop missing values to ensure high-quality training data
        merged = merged.dropna()
        merged.to_csv('data/processed_nutrition.csv', index=False)
        print(f"Success! Master dataset saved. Records: {len(merged)}")

    except Exception as e:
        print(f"Error during merge: {e}")

if __name__ == "__main__":
    merge_nhanes_data()