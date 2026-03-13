class FraudDetection {
  static analyzeClaim(claim, customer, policy) {
    const riskFactors = [];
    let riskScore = 0;

    // Check for suspicious patterns
    if (claim.claimAmount > policy.coverage * 0.8) {
      riskFactors.push({
        factor: 'High claim amount relative to coverage',
        score: 25,
        description: 'Claim amount is more than 80% of policy coverage'
      });
      riskScore += 25;
    }

    // Check time-based patterns
    const daysSincePolicyStart = Math.floor((new Date() - policy.startDate) / (1000 * 60 * 60 * 24));
    if (daysSincePolicyStart < 30) {
      riskFactors.push({
        factor: 'Recent policy claim',
        score: 20,
        description: 'Claim filed within 30 days of policy start'
      });
      riskScore += 20;
    }

    // Check claim frequency
    const claimFrequency = this.calculateClaimFrequency(customer);
    if (claimFrequency > 3) {
      riskFactors.push({
        factor: 'High claim frequency',
        score: 30,
        description: 'Customer has filed more than 3 claims in the past year'
      });
      riskScore += 30;
    }

    // Check incident date patterns
    const daysSinceIncident = Math.floor((new Date() - claim.incidentDate) / (1000 * 60 * 60 * 24));
    if (daysSinceIncident > 90) {
      riskFactors.push({
        factor: 'Delayed claim reporting',
        score: 15,
        description: 'Claim reported more than 90 days after incident'
      });
      riskScore += 15;
    }

    // Check for suspicious keywords in description
    const suspiciousKeywords = ['accidentally', 'suddenly', 'unexpectedly', 'mysterious', 'strange'];
    const foundKeywords = suspiciousKeywords.filter(keyword => 
      claim.description.toLowerCase().includes(keyword)
    );
    
    if (foundKeywords.length > 2) {
      riskFactors.push({
        factor: 'Suspicious language patterns',
        score: 20,
        description: 'Claim description contains multiple suspicious keywords'
      });
      riskScore += 20;
    }

    // Determine fraud likelihood
    let fraudLikelihood = 'low';
    let severity = 'low';
    
    if (riskScore >= 70) {
      fraudLikelihood = 'high';
      severity = 'critical';
    } else if (riskScore >= 50) {
      fraudLikelihood = 'medium';
      severity = 'high';
    } else if (riskScore >= 30) {
      fraudLikelihood = 'low';
      severity = 'medium';
    }

    return {
      isFraud: riskScore >= 50,
      riskScore,
      fraudLikelihood,
      severity,
      riskFactors,
      recommendations: this.generateRecommendations(riskFactors)
    };
  }

  static calculateClaimFrequency(customer) {
    // This would typically query the database for customer's claim history
    // For now, return a mock value
    return Math.floor(Math.random() * 5);
  }

  static generateRecommendations(riskFactors) {
    const recommendations = [];
    
    riskFactors.forEach(factor => {
      switch (factor.factor) {
        case 'High claim amount relative to coverage':
          recommendations.push('Verify claim documentation and receipts');
          recommendations.push('Request additional proof of loss');
          break;
        case 'Recent policy claim':
          recommendations.push('Review policy application for misrepresentation');
          recommendations.push('Verify customer\'s claim history');
          break;
        case 'High claim frequency':
          recommendations.push('Conduct detailed investigation of all claims');
          recommendations.push('Consider policy cancellation or premium increase');
          break;
        case 'Delayed claim reporting':
          recommendations.push('Request explanation for delay');
          recommendations.push('Verify incident timeline');
          break;
        case 'Suspicious language patterns':
          recommendations.push('Interview the claimant in detail');
          recommendations.push('Cross-reference with witness statements');
          break;
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  }
}

module.exports = FraudDetection;
