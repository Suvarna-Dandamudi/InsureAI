class RiskScore {
  static calculatePolicyRisk(customer, policyType, coverage) {
    let baseScore = 50; // Base risk score
    const riskFactors = [];

    // Age-based risk calculation
    const age = this.calculateAge(customer.dateOfBirth);
    if (age < 25) {
      baseScore += 15;
      riskFactors.push({
        factor: 'Young driver',
        impact: 15,
        description: 'Customers under 25 have higher risk'
      });
    } else if (age > 65) {
      baseScore += 10;
      riskFactors.push({
        factor: 'Senior citizen',
        impact: 10,
        description: 'Customers over 65 have moderate risk'
      });
    }

    // Policy type risk
    const typeRisk = this.getPolicyTypeRisk(policyType);
    baseScore += typeRisk.score;
    riskFactors.push(typeRisk);

    // Coverage amount risk
    if (coverage > 1000000) {
      baseScore += 10;
      riskFactors.push({
        factor: 'High coverage amount',
        impact: 10,
        description: 'Coverage over $1M increases risk'
      });
    }

    // Location-based risk (mock - would use actual location data)
    const locationRisk = Math.floor(Math.random() * 20);
    baseScore += locationRisk;
    if (locationRisk > 10) {
      riskFactors.push({
        factor: 'High-risk location',
        impact: locationRisk,
        description: 'Customer location has elevated risk factors'
      });
    }

    // Credit score impact (mock - would integrate with credit bureaus)
    const creditScore = Math.floor(Math.random() * 300) + 300;
    if (creditScore < 600) {
      baseScore += 20;
      riskFactors.push({
        factor: 'Poor credit score',
        impact: 20,
        description: 'Low credit score indicates higher risk'
      });
    } else if (creditScore < 700) {
      baseScore += 10;
      riskFactors.push({
        factor: 'Fair credit score',
        impact: 10,
        description: 'Moderate credit score'
      });
    }

    // Claims history impact
    const claimsHistory = this.getClaimsHistory(customer._id);
    baseScore += claimsHistory.score;
    riskFactors.push(claimsHistory);

    // Ensure score stays within bounds
    const finalScore = Math.min(100, Math.max(0, baseScore));

    return {
      riskScore: finalScore,
      riskCategory: this.getRiskCategory(finalScore),
      premiumMultiplier: this.getPremiumMultiplier(finalScore),
      riskFactors,
      recommendations: this.generateRiskRecommendations(finalScore, riskFactors)
    };
  }

  static calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  static getPolicyTypeRisk(policyType) {
    const riskMap = {
      'auto': { score: 15, description: 'Auto insurance has moderate risk' },
      'home': { score: 10, description: 'Home insurance has low-moderate risk' },
      'life': { score: 20, description: 'Life insurance has higher risk' },
      'health': { score: 25, description: 'Health insurance has high risk' },
      'business': { score: 30, description: 'Business insurance has highest risk' }
    };
    
    const risk = riskMap[policyType] || { score: 15, description: 'Unknown policy type' };
    return {
      factor: 'Policy type risk',
      impact: risk.score,
      description: risk.description
    };
  }

  static getClaimsHistory(customerId) {
    // Mock implementation - would query actual claims database
    const mockClaimsCount = Math.floor(Math.random() * 5);
    
    if (mockClaimsCount === 0) {
      return {
        factor: 'No claims history',
        impact: -10,
        description: 'No previous claims - lower risk'
      };
    } else if (mockClaimsCount <= 2) {
      return {
        factor: 'Few previous claims',
        impact: 5,
        description: `${mockClaimsCount} previous claims - slightly higher risk`
      };
    } else {
      return {
        factor: 'Multiple previous claims',
        impact: 15,
        description: `${mockClaimsCount} previous claims - higher risk`
      };
    }
  }

  static getRiskCategory(score) {
    if (score <= 20) return 'very_low';
    if (score <= 40) return 'low';
    if (score <= 60) return 'moderate';
    if (score <= 80) return 'high';
    return 'very_high';
  }

  static getPremiumMultiplier(score) {
    if (score <= 20) return 0.8;
    if (score <= 40) return 0.9;
    if (score <= 60) return 1.0;
    if (score <= 80) return 1.2;
    return 1.5;
  }

  static generateRiskRecommendations(score, riskFactors) {
    const recommendations = [];
    
    if (score > 70) {
      recommendations.push('Consider requiring additional documentation');
      recommendations.push('Implement stricter underwriting guidelines');
      recommendations.push('Increase premium or add deductibles');
    } else if (score > 50) {
      recommendations.push('Monitor policy closely');
      recommendations.push('Consider periodic risk reassessment');
    } else if (score < 30) {
      recommendations.push('Offer premium discounts');
      recommendations.push('Provide loyalty benefits');
    }

    // Factor-specific recommendations
    riskFactors.forEach(factor => {
      if (factor.factor === 'Young driver') {
        recommendations.push('Suggest driver training courses');
      }
      if (factor.factor === 'Poor credit score') {
        recommendations.push('Offer financial education resources');
      }
    });

    return [...new Set(recommendations)];
  }
}

module.exports = RiskScore;
