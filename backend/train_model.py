import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def train_nutrition_model():
    df = pd.read_csv('data/labeled_nutrition.csv')

    # Expanded Feature Set for the "Awesome" Dashboard
    X = df[['RIDAGEYR', 'RIAGENDR', 'DR1TIRON', 'DR1TVD', 'BMXBMI', 'BMXARMC', 'DR1TPROT', 'DR1TZINC']]
    y = df['any_deficiency']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest with expanded features...")
    # Using 200 estimators for better stability
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print(f"New Model Accuracy: {accuracy_score(y_test, y_pred):.2f}")

    joblib.dump(model, 'data/nutrition_model1.pkl')
    print("Model saved as 'data/nutrition_model1.pkl'")

if __name__ == "__main__":
    train_nutrition_model()