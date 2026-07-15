import { StyleSheet, View, Text, ScrollView} from "react-native";

export default function PostView() {
    const trialContent= "New Public Transport Project Aims to Reduce Traffic CongestionCity officials have unveiled plans for a major public transportation expansion designed to reduce traffic congestion and improve mobility for residents. The proposal includes additional bus routes, dedicated bus lanes, and modern digital ticketing systems.Transportation planners estimate that the completed project could reduce average commuting times by as much as 20 percent during peak hours."
    return (
        <View>
            <ScrollView>
            <View style= {{padding: 10}}>
            <Text style= {{fontSize: 30}}>This is the Headline Section</Text>
            </View>
            <View style= {{backgroundColor: "lightblue", height: 200, width: "auto", margin: 10, borderRadius: 10}}>
            </View>
            <View style= {{padding:10}}> 
                <Text style= {{fontSize: 16, paddingBottom: 10}}>{trialContent}</Text>
                <Text style= {{fontSize: 16, paddingBottom: 10}}>{trialContent}</Text>
                <Text style= {{fontSize: 16, paddingBottom: 10}}>{trialContent}</Text>
                <Text style= {{fontSize: 16, paddingBottom: 10}}>{trialContent}</Text>
            </View>

            </ScrollView>
        </View>
    )
}