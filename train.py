import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import pickle
import os

def train_model():
    print("Loading dataset...")
    url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/diamonds.csv"
    df = pd.read_csv(url)
    
    print("Preprocessing data...")
    # Encoding categorical features
    # Cut: Ideal, Premium, Very Good, Good, Fair
    # Color: D, E, F, G, H, I, J
    # Clarity: IF, VVS1, VVS2, VS1, VS2, SI1, SI2, I1
    
    le_dict = {}
    categorical_cols = ['cut', 'color', 'clarity']
    
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        le_dict[col] = le
        
    X = df.drop('price', axis=1)
    y = df['price']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    score = model.score(X_test, y_test)
    print(f"Model R2 Score: {score:.4f}")
    
    # Save model and encoders
    os.makedirs('artifacts', exist_ok=True)
    
    with open('artifacts/model.pkl', 'wb') as f:
        pickle.dump(model, f)
        
    with open('artifacts/encoders.pkl', 'wb') as f:
        pickle.dump(le_dict, f)
        
    print("Model and encoders saved to artifacts folder.")

if __name__ == "__main__":
    train_model()
