import pandas as pd

def apply_clinical_labels():
    df = pd.read_csv('data/processed_nutrition.csv')

    # Iron Deficiency: Ferritin < 15 ug/L
    df['iron_deficient'] = (df['LBDFERSI'] < 15).astype(int)

    # Vit D Deficiency: < 50 nmol/L
    df['vit_d_deficient'] = (df['LBXVIDMS'] < 50).astype(int)

    # General Risk Label
    df['any_deficiency'] = ((df['iron_deficient'] == 1) | (df['vit_d_deficient'] == 1)).astype(int)

    df.to_csv('data/labeled_nutrition.csv', index=False)
    print("Step 2 Complete: Clinical labels applied.")

if __name__ == "__main__":
    apply_clinical_labels()