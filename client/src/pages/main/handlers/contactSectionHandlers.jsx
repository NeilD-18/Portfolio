import axios from "axios";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

export const handleFetchSocialLinks = async (setSocialLinks, socialPlatformsHover) => {
    try {
      const { data } = await axios.get("/contact");
      const updatedLinks = {};

      Object.keys(socialPlatformsHover).forEach((key) => {
        if (data[`${key}Username`]) {
          updatedLinks[key] = socialPlatformsHover[key].baseUrl + data[`${key}Username`];
        }
      });

      setSocialLinks(updatedLinks);
    } catch (error) {
      console.error("Error fetching social media links:", error);
    }
};


export const handleContactFormSubmit = (e, setLoading, setForm, form) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Neil Daterao",
          from_email: form.email,
          to_email: "ndaterao2@gmail.com",
          message: form.message,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          toast("Thank you! I'll get back to you soon!", {
            icon: '✅',
            style: {
                borderRadius: '10px',
                background: '#1c1c1e',
                color: '#fff',
            },
        });
          setForm({ name: "", email: "", message: "" });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          toast('Something went wrong, try again!', {
            icon: '❌',
            style: {
                borderRadius: '10px',
                background: '#1c1c1e',
                color: '#fff',
            },
        });
        }
      );
  };
