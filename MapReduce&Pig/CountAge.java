import java.io.IOException;
import java.util.Iterator;

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
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class CountAge {
	public static void main(String[] args) throws Exception {
		if (args.length != 2) {
			System.err.println("Usage: ReadJSONHadoop <input path> <output path>");
			System.exit(-1);
		}
		JobConf conf = new JobConf(CountAge.class);
		conf.setJobName("Count Age");
		FileInputFormat.setInputPaths(conf, new Path(args[0]));
		FileOutputFormat.setOutputPath(conf, new Path(args[1]));
		conf.setOutputKeyClass(Text.class);
		conf.setOutputValueClass(Text.class);
		conf.setMapperClass(CountAgeMap.class);
		conf.setReducerClass(CountAgeReduce.class);
		conf.setInputFormat(TextInputFormat.class);
		conf.setOutputFormat(TextOutputFormat.class);
		JobClient.runJob(conf);
	}
}

class CountAgeMap extends MapReduceBase implements
Mapper<LongWritable, Text, Text, Text> {	

	public void map(LongWritable key, Text value,
			OutputCollector<Text, Text> output, Reporter reporter)
					throws IOException {			
		JSONParser parser = new JSONParser();		
		Object obj;
		try {
			obj = parser.parse(value.toString()); 
			JSONObject jsonObject=(JSONObject)obj;			
			Text companyKey = new Text();
			Text companyValue = new Text();
			boolean category = jsonObject.get("category_code") != null;
			if (category) {
				companyKey.set(jsonObject.get("category_code").toString());
				boolean age = jsonObject.get("founded_year")!=null;
				if (age) {
					companyValue.set("1");
					output.collect(companyKey, companyValue);
				}
			}						
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 	
	}
}

class CountAgeReduce extends MapReduceBase implements 
Reducer<Text, Text, Text, Text> {	
	public void reduce(Text key, Iterator<Text> values,
			OutputCollector<Text, Text> output, Reporter reporter)
					throws IOException {
		int count = 0;
		while(values.hasNext()) {
			values.next();
			count++;
		}
		String amount = new Integer(count).toString();
		output.collect(key, new Text(amount));
	}
}