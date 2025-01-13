import axios from "axios"

export const handleFetchExperiences = async(setExperiences) => { 
    
    
    try { 
        const experienceResponse = await axios.get('/experiences')
        
        const experiences = experienceResponse.data.map((experience) => ({
            ...experience,
            responsibilities: experience.responsibilities
            .split(".")
            .map((item) => item.trim()) 
            .filter((item) => item.length > 0)
        })) 
        setExperiences(experiences)
    } catch (error) { 
        console.log("Failed to fetch experiences", error)
    }


}