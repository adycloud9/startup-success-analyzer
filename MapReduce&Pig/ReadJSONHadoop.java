import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapred.FileInputFormat;
import org.apache.hadoop.mapred.FileOutputFormat;
import org.apache.hadoop.mapred.JobClient;
import org.apache.hadoop.mapred.JobConf;
import org.apache.hadoop.mapred.MapReduceBase;
import org.apache.hadoop.mapred.Mapper;
import org.apache.hadoop.mapred.OutputCollector;
import org.apache.hadoop.mapred.Reducer;
import org.apache.hadoop.mapred.Reporter;
import org.apache.hadoop.mapred.TextInputFormat;
import org.apache.hadoop.mapred.TextOutputFormat;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class ReadJSONHadoop {
	public static void main(String[] args) throws Exception {
		if (args.length != 2) {
			System.err.println("Usage: ReadJSONHadoop <input path> <output path>");
			System.exit(-1);
		}
		JobConf conf = new JobConf(ReadJSONHadoop.class);
		conf.setJobName("ReadJSONHadoop");
		FileInputFormat.setInputPaths(conf, new Path(args[0]));
		FileOutputFormat.setOutputPath(conf, new Path(args[1]));
		conf.setOutputKeyClass(Text.class);
		conf.setOutputValueClass(Text.class);
		conf.setMapperClass(ReadJSONHadoopMap.class);
		conf.setReducerClass(ReadJSONHadoopReduce.class);
		conf.setInputFormat(TextInputFormat.class);
		conf.setOutputFormat(TextOutputFormat.class);
		JobClient.runJob(conf);
	}
}

class ReadJSONHadoopMap extends MapReduceBase implements
Mapper<LongWritable, Text, Text, Text> {	

	public void map(LongWritable key, Text value,
			OutputCollector<Text, Text> output, Reporter reporter)
					throws IOException {			
		JSONParser parser = new JSONParser();		
		Object obj;
		try {
			obj = parser.parse(value.toString()); 
			JSONObject jsonObject=(JSONObject)obj;
			String values = "";
			Text companyKey = new Text();
			Text companyValue = new Text();
			boolean acquired = jsonObject.get("acquisition") != null;
			if (acquired) {
				companyKey.set("Acquired");
			} else {
				companyKey.set("Unacquired");
			}
			
			// Basic features extract
			if (jsonObject.get("number_of_employees") != null) {
				values += jsonObject.get("number_of_employees").toString() + " ";				
			} else {
				values += "- ";
			}
			long year = Calendar.getInstance().get(Calendar.YEAR);
			if(jsonObject.get("founded_year")!=null)
			{
				long d = (Long)jsonObject.get("founded_year");
				long m = 1;
				long month = Calendar.getInstance().get(Calendar.MONTH) + 1;
				if (jsonObject.get("founded_month")!=null) {
					m = (Long)jsonObject.get("founded_month");
				}
				if (jsonObject.get("acquisition")!=null) {
					JSONObject acqObj = (JSONObject) jsonObject.get("acquisition");
					if (acqObj.get("acquired_year") != null) {
						year = (Long)acqObj.get("acquired_year");
					}
					if (acqObj.get("acquired_month") != null) {
						month = (Long)acqObj.get("acquired_month");
					}
				}
				//Long age=((year * 12) + month ) - ((d * 12) + m);
				Long age = ((year - d) * 12) + (month - m);
				if (530 > age) {
					values += age.toString() + " ";
				} else {
					values += "- ";
				}
			} else {
				values += "- ";
			}
			if(jsonObject.get("products")!=null)
			{
				JSONArray prods=(JSONArray) jsonObject.get("products");
				int d=prods.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			if(jsonObject.get("milestones")!=null)
			{
				JSONArray miles=(JSONArray) jsonObject.get("milestones");
				int d=miles.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			if(jsonObject.get("providerships")!=null)
			{
				JSONArray providers=(JSONArray) jsonObject.get("providerships");
				int d=providers.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			if(jsonObject.get("offices")!=null)
			{
				JSONArray off=(JSONArray) jsonObject.get("offices");
				int d=off.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			
			// Competitors extract
			if(jsonObject.get("competitions")!=null)
			{
				JSONArray comp=(JSONArray) jsonObject.get("competitions");
				int d=comp.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			
			// Finance extract
			if(jsonObject.get("acquisitions")!=null)
			{
				JSONArray acq=(JSONArray) jsonObject.get("acquisitions");
				int d=acq.size();
				values += d + " ";
			} else {
				values += "- ";
			}
			if(jsonObject.get("funding_rounds")!=null)
			{
				JSONArray funds=(JSONArray) jsonObject.get("funding_rounds");
				int d=funds.size();				
				values += d + " ";
				long totalRaisedAmt = 0;
				int totalInv = 0;
				for (int i = 0; i < d; ++i) 
				{
					JSONObject j = (JSONObject) funds.get(i);
					if(j.get("raised_amount")!=null)
					{						
						totalRaisedAmt += (Long)j.get("raised_amount");						
					}
					if(j.get("investments")!=null)
					{
						JSONArray inv=(JSONArray) j.get("investments");
						totalInv += inv.size();						
					}
				}
				double raisedAmountAvg = (double) totalRaisedAmt / d;
				double investmentsAvg = (double) totalInv / d;
				if (raisedAmountAvg > 0) {
					values += raisedAmountAvg + " ";
				} else {
					values += "- ";
				}
				if (investmentsAvg > 0) {
					values += investmentsAvg + " ";
				} else {
					values += "- ";
				}
			} else {
				values += "- - - ";
			}
			companyValue.set(values);
			output.collect(companyKey, companyValue);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 	
	}
}

class ReadJSONHadoopReduce extends MapReduceBase implements 
Reducer<Text, Text, Text, Text> {	
	private static final DecimalFormat f = new DecimalFormat("#0.000000");
	public void reduce(Text key, Iterator<Text> values,
			OutputCollector<Text, Text> output, Reporter reporter)
					throws IOException {
		int comcount = 0;
		long empSum = 0;
		int empSumCount = 0;
		long productSum = 0;
		int productSumCount = 0;
		long companyAgeSum = 0;
		int companyAgeCount = 0;
		long milestoneSum = 0;
		int milestoneCount = 0;		
		long numOfficesSum = 0;
		int officeCount = 0;
		long numProviderSum = 0;
		int providerCount = 0;
		long competitionSum = 0;
		int competitionCount = 0;
		long acquisitionsSum = 0;
		int acqusitionsCount = 0;
		long fundingRoundsSum = 0;
		int fundingRoundsCount = 0;
		double raisedAmountSum = 0;
		int raisedAmountCount = 0;
		double investmentsSum = 0;
		int investmentsCount = 0;
		List<Double> empList = new ArrayList<Double>();
		List<Double> prodList = new ArrayList<Double>();
		List<Double> ageList = new ArrayList<Double>();
		List<Double> mileList = new ArrayList<Double>();		
		List<Double> officeList = new ArrayList<Double>();
		List<Double> providerList = new ArrayList<Double>();
		List<Double> competitionList = new ArrayList<Double>();
		List<Double> acqusitionsList = new ArrayList<Double>();
		List<Double> fundingRoundsList = new ArrayList<Double>();
		List<Double> raisedAmountList = new ArrayList<Double>();
		List<Double> investmentsList = new ArrayList<Double>();
		while (values.hasNext()) {
			String[] value = values.next().toString().split("\\s+");
			if (!"-".equals(value[0])) {
				try {
					int emp = Integer.parseInt(value[0]);
					empSum += emp;
					empList.add((double) emp);
					empSumCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[1])) {
				try {
					int age = Integer.parseInt(value[1]);
					companyAgeSum += age;
					ageList.add((double) age);
					companyAgeCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[2])) {
				try {
					int prod = Integer.parseInt(value[2]);
					productSum += prod;
					prodList.add((double) prod);
					productSumCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[3])) {
				try {
					int miles = Integer.parseInt(value[3]);
					milestoneSum += miles;
					mileList.add((double) miles);
					milestoneCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[4])) {
				try {
					int provider = Integer.parseInt(value[4]);
					numProviderSum += provider;
					providerList.add((double) provider);
					providerCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[5])) {
				try {
					int office = Integer.parseInt(value[5]);
					numOfficesSum += office;
					officeList.add((double) office);
					officeCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[6])) {
				try {
					int competition = Integer.parseInt(value[6]);
					competitionSum += competition;
					competitionList.add((double) competition);
					competitionCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[7])) {
				try {
					int acqusitions = Integer.parseInt(value[7]);
					acquisitionsSum += acqusitions;
					acqusitionsList.add((double) acqusitions);
					acqusitionsCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[8])) {
				try {
					int fundingRounds = Integer.parseInt(value[8]);
					fundingRoundsSum += fundingRounds;
					fundingRoundsList.add((double) fundingRounds);
					fundingRoundsCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[9])) {
				try {
					double raisedAmount = Double.parseDouble(value[9]);
					raisedAmountSum += raisedAmount;
					raisedAmountList.add(raisedAmount);
					raisedAmountCount++;
				} catch (NumberFormatException e) {}
			}
			if (!"-".equals(value[10])) {
				try {
					double investments = Double.parseDouble(value[10]);
					investmentsSum += investments;
					investmentsList.add(investments);
					investmentsCount++;
				} catch (NumberFormatException e) {}
			}

			comcount++;		
		}
		double empAvg = 0, empStd = 0;
		double ageAvg = 0, ageStd = 0;
		double productAvg = 0, productStd = 0; 
		double milestoneAvg = 0, milestoneStd = 0;
		double providerAvg = 0, providerStd = 0;
		double officeAvg = 0, officeStd = 0;
		double competitionAvg = 0, competitionStd = 0;
		double acqusitionsAvg = 0, acqusitionsStd = 0;
		double fundingRoundsAvg = 0, fundingRoundsStd = 0;
		double raisedAmountAvg = 0, raisedAmountStd = 0;
		double investmentsAvg = 0, investmentsStd = 0;

		if (empSumCount > 0) {
			empAvg = (double) empSum / empSumCount;
			empStd = standardDeviation(empList,empAvg);
		}
		if (companyAgeCount > 0) {
			ageAvg = (double) companyAgeSum / companyAgeCount;
			ageStd = standardDeviation(ageList, ageAvg);
		}
		if (productSumCount > 0) {
			productAvg = (double) productSum / productSumCount;
			productStd = standardDeviation(prodList, productAvg);
		}
		if (milestoneCount > 0) {
			milestoneAvg = (double) milestoneSum / milestoneCount;
			milestoneStd = standardDeviation(mileList, milestoneAvg);
		}
		if (providerCount > 0) {
			providerAvg = (double) numProviderSum / providerCount;
			providerStd = standardDeviation(providerList, providerAvg);
		}
		if (officeCount > 0) {
			officeAvg = (double) numOfficesSum / officeCount;
			officeStd = standardDeviation(officeList, officeAvg);
		}
		if (competitionCount > 0) {
			competitionAvg = (double) competitionSum / competitionCount;
			competitionStd = standardDeviation(competitionList, competitionAvg);
		}
		if (acqusitionsCount > 0) {
			acqusitionsAvg = (double) acquisitionsSum / acqusitionsCount;
			acqusitionsStd = standardDeviation(acqusitionsList, acqusitionsAvg);
		}
		if (fundingRoundsCount > 0) {
			fundingRoundsAvg = (double) fundingRoundsSum / fundingRoundsCount;
			fundingRoundsStd = standardDeviation(fundingRoundsList, fundingRoundsAvg);
		}
		if (raisedAmountCount > 0) {
			raisedAmountAvg = (double) raisedAmountSum / raisedAmountCount;
			raisedAmountStd = standardDeviation(raisedAmountList, raisedAmountAvg);
		}
		if (investmentsCount > 0) {
			investmentsAvg = (double) investmentsSum / investmentsCount;
			investmentsStd = standardDeviation(investmentsList, investmentsAvg);
		}
		String outputValues = f.format(empAvg).toString() + " " + f.format(empStd).toString() + " " + empSumCount + " " +
				f.format(ageAvg).toString() + " " + f.format(ageStd).toString() + " " + companyAgeCount + " " +
				f.format(productAvg).toString() + " " + f.format(productStd).toString() + " " + productSumCount + " " +
				f.format(milestoneAvg).toString() + " " + f.format(milestoneStd).toString() + " " + milestoneCount + " " +
				f.format(providerAvg).toString() + " " + f.format(providerStd).toString() + " " + providerCount + " " +
				f.format(officeAvg).toString() + " " + f.format(officeStd).toString() + " " + officeCount + " " +
				f.format(competitionAvg).toString() + " " + f.format(competitionStd).toString() + " " + competitionCount + " " +
				f.format(acqusitionsAvg).toString() + " " + f.format(acqusitionsStd).toString() + " " + acqusitionsCount + " " +
				f.format(fundingRoundsAvg).toString() + " " + f.format(fundingRoundsStd).toString() + " " + fundingRoundsCount + " " +
				f.format(raisedAmountAvg).toString() + " " + f.format(raisedAmountStd).toString() + " " + raisedAmountCount + " " +
				f.format(investmentsAvg).toString() + " " + f.format(investmentsStd).toString() + " " + investmentsCount + " " +
				comcount; 
		output.collect(key, new Text(outputValues));		
	}

	public static double standardDeviation(List<Double> numbers,double average)
	{		
		List<Double> listOfDifferences = new ArrayList<Double>();
		for(double number : numbers) {
			double difference = number - average;
			listOfDifferences.add(difference);
		}
		List<Double> squares = new ArrayList<Double>();
		for(double difference : listOfDifferences) {
			double square = difference * difference;
			squares.add(square);
		}
		double sum = 0;
		for(double number : squares) {
			sum = sum + number;
		}
		double result = sum / numbers.size();
		double standardDeviation = Math.sqrt(result);
		return standardDeviation;
	}
}