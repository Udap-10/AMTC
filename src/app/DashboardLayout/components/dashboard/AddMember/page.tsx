"use client";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Define types for API responses
type ApiResponse = {
  message?: string;
};

const AddMember: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [name, setName] = useState("");
  const [CID, setCID] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [Dzongkhag, setDzongkhag] = useState("");
  const [Gewog, setGewog] = useState("");
  const [Village, setVillage] = useState("");
  const [systemID, setSystemID] = useState(1); // Default to 1
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Dzongkhag and Gewog mapping
  // Dzongkhag and Gewog mappings
  const locationData: { [key: string]: string[] } = {
    Bumthang: ["Chhoekhor", "Chhume", "Tang", "Ura"],
    Chhukha: [
      "Bongo",
      "Chapcha",
      "Darla",
      "Dungna",
      "Geling",
      "Getena",
      "Lokchina",
      "Metakha",
      "Phuentsholing",
      "Sampheling",
    ],
    Dagana: [
      "Dorona",
      "Gesarling",
      "Gozhi",
      "Kana",
      "Khebisa",
      "Lajab",
      "Nichula",
      "Tseza",
      "Tsangkha",
      "Tshendagang",
      "Tseza",
    ],
    Gasa: ["Goenkhamey", "Goenkhatoe", "Laya", "Lunana"],
    Haa: ["Bji", "Gakiling", "Katsho", "Samar", "Sangbay", "Uesu"],
    Lhuentse: [
      "Gangzur",
      "Jarey",
      "Khoma",
      "Kurtoe",
      "Menbi",
      "Metsho",
      "Mingkhar",
      "Tsenkhar",
    ],
    Mongar: [
      "Balam",
      "Chaskhar",
      "Chhali",
      "Drametse",
      "Drepung",
      "Gongdue",
      "Jurmey",
      "Kengkhar",
      "Mongar",
      "Narang",
      "Ngatshang",
      "Saleng",
      "Shermung",
      "Silambi",
      "Thangrong",
      "Tsamang",
    ],
    Paro: [
      "Doga",
      "Doteng",
      "Hungrel",
      "Lamgong",
      "Lungnyi",
      "Naja",
      "Shaba",
      "Tsento",
      "Wangchang",
      "Shari",
    ],
    Pemagatshel: [
      "Chhimung",
      "Choekhorling",
      "Chongshing",
      "Dechheling",
      "Dungmin",
      "Khar",
      "Nanong",
      "Norbugang",
      "Shumar",
      "Yurung",
      "Zobel",
    ],
    Punakha: [
      "Chhubu",
      "Dzome",
      "Goenshari",
      "Guma",
      "Kabjisa",
      "Lingmukha",
      "Shenga Bjemi",
      "Talo",
      "Toewang",
      "Toedwang",
    ],
    SamdrupJongkhar: [
      "Dewathang",
      "Gomdar",
      "Langchenphu",
      "Lauri",
      "Martshala",
      "Orong",
      "Pemathang",
      "Phuntshothang",
      "Samrang",
      "Serthi",
      "Wangphu",
    ],
    Samtse: [
      "Bara",
      "Biru",
      "Chahukha",
      "Denchukha",
      "Dophuchen",
      "Dungtoe",
      "Gomtu",
      "Namgaycholing",
      "Norgaygang",
      "Phuentshogpelri",
      "Samtse",
      "Tading",
      "Tendruk",
      "Ugyentse",
      "Yoeseltse",
    ],
    Sarpang: [
      "Bhur",
      "Chhuzagang",
      "Dekiling",
      "Gelephu",
      "Jigmecholing",
      "Samtenling",
      "Serzhong",
      "Shompangkha",
      "Tareythang",
      "Umling",
    ],
    Thimphu: [
      "Kawang",
      "Chang",
      "Dagala",
      "Genye",
      "Lingzhi",
      "Mewang",
      "Naro",
      "Soe",
    ],
    Trashigang: [
      "Bartsham",
      "Bidung",
      "Kanglung",
      "Kangpara",
      "Khaling",
      "Lumang",
      "Merak",
      "Phongmey",
      "Radhi",
      "Sakten",
      "Samkhar",
      "Shongphu",
      "Thrimshing",
      "Uzorong",
      "Yangnyer",
    ],
    Trashiyangtse: [
      "Bumdeling",
      "Jamkhar",
      "Khamdang",
      "Ramjar",
      "Toetsho",
      "Tomzhangtshen",
      "Yangtse",
      "Yalang",
    ],
    Trongsa: ["Drakteng", "Korphu", "Langthil", "Nubi", "Tangsibji"],
    Tsirang: [
      "Barzhong",
      "Goserling",
      "Kikhorthang",
      "Mendrelgang",
      "Patala",
      "Phuntenchhu",
      "Rangthangling",
      "Semjong",
      "Tsholingkhar",
      "Tsirangtoe",
      "Dunglagang",
      "Tsholingkhar",
    ],
    WangduePhodrang: [
      "Athang",
      "Bjena",
      "Daga",
      "Dangchu",
      "Gangte",
      "Gasetsho Gom",
      "Gasetsho Wom",
      "Nahi",
      "Nyisho",
      "Phangyul",
      "Sephu",
      "Thedtsho",
      "Ruepisa",
    ],
    Zhemgang: [
      "Bardo",
      "Bjoka",
      "Goshing",
      "Nangkor",
      "Ngangla",
      "Phangkhar",
      "Shingkhar",
      "Trong",
    ],
  };
  const handleBackClick = () => {
    router.push("/DashboardLayout/components/farmers");
  };

  const handleSubmit = async () => {
    // Reset previous messages
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required fields
    if (!name || !CID || !contactNumber) {
      setErrorMessage("Name, CID and Contact Number are required");
      return;
    }

    // Validate CID and contact number lengths

    if (contactNumber.length !== 8) {
      setErrorMessage("Contact Number must be 8 digits.");
      return;
    }

    // Start loading state
    setLoading(true);

    const newMember = {
      name,
      CID,
      contactNumber,
      Dzongkhag,
      Gewog,
      Village,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Farmer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMember),
        }
      );

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to add new member.");
        return;
      }

      // Set success message and clear the form
      setSuccessMessage("Farmer successfully added to the system.");
      setName("");
      setCID("");
      setContactNumber("");
      setDzongkhag("");
      setGewog("");
      setVillage("");
      setSystemID(1); // Reset to default value

      // Redirect after a delay
      setTimeout(
        () => router.push("/DashboardLayout/components/farmers"),
        2000
      );
    } catch (error) {
      console.error("Error adding new member:", error);
      setErrorMessage("An error occurred while adding the new member.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#f7fdf4",
        borderRadius: 3,
        maxWidth: 600,
        margin: "auto",
        boxShadow: isDarkMode
          ? "0px 0px 10px rgba(255,255,255,0.1)"
          : "0px 4px 8px rgba(0, 0, 0, 0.1)",
        color: isDarkMode ? "#fff" : "#000",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: isDarkMode ? "#000" : "forestgreen",
          textAlign: "center",
          marginBottom: 3,
          fontWeight: "bold",
        }}
      >
        Add New Member
      </Typography>

      {successMessage && (
        <Typography
          variant="h6"
          sx={{
            color: "green",
            textAlign: "center",
            marginBottom: 2,
            fontWeight: "bold",
          }}
        >
          {successMessage}
        </Typography>
      )}

      {errorMessage && (
        <Typography
          variant="h6"
          sx={{
            color: "red",
            textAlign: "center",
            marginBottom: 2,
            fontWeight: "bold",
          }}
        >
          {errorMessage}
        </Typography>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              input: { color: isDarkMode ? "#ddd" : "#000" },
              label: { color: isDarkMode ? "#bbb" : "inherit" },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="CID"
            variant="outlined"
            fullWidth
            value={CID}
            onChange={(e) => setCID(e.target.value)}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              input: { color: isDarkMode ? "#ddd" : "#000" },
              label: { color: isDarkMode ? "#bbb" : "inherit" },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Contact Number"
            variant="outlined"
            fullWidth
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              input: { color: isDarkMode ? "#ddd" : "#000" },
              label: { color: isDarkMode ? "#bbb" : "inherit" },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Select
            displayEmpty
            fullWidth
            value={Dzongkhag}
            onChange={(e) => {
              setDzongkhag(e.target.value);
              setGewog(""); // reset gewog when dzongkhag changes
            }}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              color: isDarkMode ? "#ddd" : "#000",
            }}
            renderValue={(selected) => selected || "Select Dzongkhag"}
          >
            {Object.keys(locationData).map((dzongkhag) => (
              <MenuItem key={dzongkhag} value={dzongkhag}>
                {dzongkhag}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid item xs={12}>
          <Select
            displayEmpty
            fullWidth
            value={Gewog}
            onChange={(e) => setGewog(e.target.value)}
            disabled={!Dzongkhag}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              color: isDarkMode ? "#ddd" : "#000",
            }}
            renderValue={(selected) => selected || "Select Gewog"}
          >
            {Dzongkhag &&
              locationData[Dzongkhag]?.map((gewog) => (
                <MenuItem key={gewog} value={gewog}>
                  {gewog}
                </MenuItem>
              ))}
          </Select>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Village"
            variant="outlined"
            fullWidth
            value={Village}
            onChange={(e) => setVillage(e.target.value)}
            sx={{
              backgroundColor: isDarkMode ? "#2a2a2a" : "#fff",
              input: { color: isDarkMode ? "#ddd" : "#000" },
              label: { color: isDarkMode ? "#bbb" : "inherit" },
            }}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={handleBackClick}
          sx={{
            backgroundColor: "#99cc66",
            color: "#fff",
            "&:hover": { backgroundColor: "#85b358" },
          }}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: "forestgreen",
            color: "#fff",
            "&:hover": { backgroundColor: "#228B22" },
          }}
          disabled={loading} // Disable button when loading
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddMember;
