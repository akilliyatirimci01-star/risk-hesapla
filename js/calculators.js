const RiskMath = {
    // 1. Kelly Kriteri
    kelly: (winProb, rr) => {
        let p = winProb / 100;
        let q = 1 - p;
        let b = parseFloat(rr);
        let f = (b * p - q) / b;
        return f > 0 ? f : 0;
    },

    // 2. Black-Scholes (Basitleştirilmiş)
    bs: (S, K, days, vol) => {
        let T = days / 365;
        let v = vol / 100;
        let r = 0.05; // Risksiz faiz %5 sabit
        
        let d1 = (Math.log(S/K) + (r + v*v/2)*T) / (v*Math.sqrt(T));
        let d2 = d1 - v*Math.sqrt(T);
        
        // Kümülatif Normal Dağılım
        function cnd(x) {
            var a1 =  0.31938153, a2 = -0.356563782, a3 =  1.781477937, a4 = -1.821255978, a5 =  1.330274429;
            var L = Math.abs(x), k = 1 / (1 + 0.2316419 * L);
            var w = 1 - 1 / Math.sqrt(2 * Math.PI) * Math.exp(-L*L / 2) * (a1*k + a2*k*k + a3*Math.pow(k,3) + a4*Math.pow(k,4) + a5*Math.pow(k,5));
            return x < 0 ? 1 - w : w;
        }

        let Call = S * cnd(d1) - K * Math.exp(-r*T) * cnd(d2);
        let Put = K * Math.exp(-r*T) * cnd(-d2) - S * cnd(-d1);
        
        return { call: Call.toFixed(2), put: Put.toFixed(2) };
    },

    // 3. Portföy Riski (Örnek: İki varlık)
    portfolio: (weightA) => {
        let w1 = weightA / 100;
        let w2 = 1 - w1;
        let v1 = 0.15, v2 = 0.60, corr = 0.2; // Varsayılan volatilite değerleri
        let variance = (w1**2 * v1**2) + (w2**2 * v2**2) + (2 * w1 * w2 * corr * v1 * v2);
        return (Math.sqrt(variance) * 100).toFixed(2);
    }
};
