// test.js
import dotenv from 'dotenv';

import {Plans, Tags} from '../models/planModel.js';
import LocationDataset from '../models/locationDataset.js';
import PlanDataset from '../models/planDataset.js';
import Plan from '../models/plan.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

async function main() {

  // Default parameters
  const avgTimePerLocation = 1.5;
  const maxPoolSize = 10;
  const budgetTimeRatio = 0.5;
  const budgetProbThreshold = 0.2;
  const timeThreshold = 0;

  // Create a dummy plan ID for testing
//   const planId = 'TEST-' + Date.now();
    const mostRecentPlan = await Plans.findOne({ PLAN_USER: 'USR-001' }).sort({ _id: -1 });
    // const planId = '241112-001030';
    const planId = mostRecentPlan._id;

  try {
    // Load datasets
    const locationDataset = new LocationDataset();
    await locationDataset.initialize();
    // console.log('LocationDataset:', locationDataset.data);

    // Initialize PlanDataset
    const planDataset = new PlanDataset(
      locationDataset,
      avgTimePerLocation
    );
    await planDataset.initialize();
    console.log('PlanDataset:', planDataset.data);

    // Create a new plan for testing
    const plan = new Plan(
      planId,
      planDataset,
      locationDataset,
      maxPoolSize,
      budgetTimeRatio,
      budgetProbThreshold,
      timeThreshold
    );

    console.log('Plan:', plan);
    
    // Test generatePlan method
    const generatedPlanDetail = plan.generatePlan(locationDataset);
    console.log('Generated Plan Detail:', generatedPlanDetail);

    // // Press Re-Generate plan and show Plan Detail
    // const regeneratedPlanDetail = plan.generatePlan(locationDataset);
    // console.log('Regenerated Plan Detail:', regeneratedPlanDetail);

    // // Test acceptPlan method (optional, you can comment this out if you don't want to save test data)
    // // await plan.acceptPlan(connectionString, dbName);
    // // console.log('Plan accepted and saved.');

    // console.log('Test completed successfully.');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main();