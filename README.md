# 💎 Diamond Price Prediction

An AI-powered valuation engine that predicts the price of diamonds based on their physical characteristics (carat, cut, color, clarity, etc.) with **98.15% accuracy**.

## ✨ Features
- **High-Accuracy Model**: Trained on the classic 'diamonds' dataset using Random Forest Regression.
- **Premium UI**: Modern glassmorphic dashboard with animated results and a sleek dark theme.
- **FastAPI Backend**: Robust and fast asynchronous API for handling predictions.
- **Real-time Valuation**: Instant price estimations with confidence indicators.

## 🚀 Deployment (GitHub & Vercel)

1. **GitHub**: Create a repo and push your code.
2. **Vercel**: Link your GitHub repo. It will detect `vercel.json` and deploy automatically.

---

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the model (optional)**:
   ```bash
   python train.py
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the Dashboard**:
   Open your browser and navigate to `http://localhost:8000`

## 📊 Technical Details
- **Algorithm**: Random Forest Regressor
- **Features**: Carat, Cut, Color, Clarity, Depth, Table, X, Y, Z
- **Encoder**: Label Encoding for categorical features
- **R2 Score**: ~0.9815