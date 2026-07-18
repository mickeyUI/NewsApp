import { StyleSheet, View, Text, ScrollView, Image, Pressable} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";

export default function PostView() {
    const route = useRoute();
    const {post}: any = route.params;
    const [content, setContent]= useState(post.textAm);
    const [lang, setLang] = useState("amh")
    const changeLang= () => {
        if (lang == "amh") {
            setContent(post.textEn);
            setLang("eng")
        } else {
            setContent(post.textAm)
            setLang("amh")
        }
    }

    type imagee = {
        image: string
    }

    const IMG= ({image}: imagee) => {
        if (!image) {
            return
        }
        return (
            <Image source={{uri: image}} style= {{ height: 200, width: "auto", margin: 10, borderRadius: 10}} />
        )
    }
    return (
        <View>
            <ScrollView>
            <View style= {{padding: 10}}>
            <Text style= {{fontSize: 30}}>{post.summarizedText}</Text>
            </View>
            
            <IMG image= {post.headerImage}/>
           
            <View style= {{padding:10}}> 
                <Text style= {{fontSize: 16, paddingBottom: 10}}>{content}</Text>
            </View>

            <Pressable onPress={() => {changeLang();}} style= {{height: 40, justifyContent:"center", alignItems: "center", backgroundColor: "lightgreen",margin: 10, marginBottom: 20}}>
                <Text>Language Change</Text>
            </Pressable>

            </ScrollView>
        </View>
    )
}