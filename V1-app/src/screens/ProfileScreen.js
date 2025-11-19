import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform // <-- FIXED: Platform is now imported
} from "react-native";
import { 
  User, Mail, Lock, Phone, MapPin, LogOut, 
  Globe, Bell, Camera, Heart, TrendingUp, 
  History, Bookmark, HelpCircle, Shield, ChevronRight, Edit2 
} from "lucide-react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, login, logout, signup } = useAuth();
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "", email: "", password: "", confirmPassword: "", mobile: "", location: "",
  });
  const [signupErrors, setSignupErrors] = useState({});

  // Profile data (Synced with user context)
  const [profileData, setProfileData] = useState({
    name: "", email: "", phone: "", language: "english", notifications: true,
  });

  // Sync profile data whenever 'user' changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        language: "english",
        notifications: true,
      });
    } else {
      // Reset forms when logged out
      setLoginData({ email: "", password: "" });
      setSignupData({
        name: "", email: "", password: "", confirmPassword: "", mobile: "", location: "",
      });
      setIsEditing(false); // Stop editing if user logs out
    }
  }, [user]);

  // --- Validation Logic ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(loginData.email)) errors.email = "Invalid email";
    if (!loginData.password) errors.password = "Password is required";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = () => {
    const errors = {};
    if (!signupData.name.trim()) errors.name = "Name is required";
    if (!signupData.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(signupData.email)) errors.email = "Invalid email";
    if (!signupData.password) errors.password = "Password is required";
    else if (signupData.password.length < 6) errors.password = "Min 6 chars";
    if (signupData.password !== signupData.confirmPassword) errors.confirmPassword = "Passwords mismatch";
    if (!signupData.mobile.trim()) errors.mobile = "Mobile required";
    else if (!validateMobile(signupData.mobile)) errors.mobile = "Invalid number";
    if (!signupData.location.trim()) errors.location = "Location required";
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- Handlers ---
  const handleLogin = async () => {
    if (!validateLoginForm()) return;
    setIsLoading(true);
    
    const result = await login(loginData.email, loginData.password);
    
    setIsLoading(false);
    if (!result.success) {
      Alert.alert("Login Failed", result.error);
    }
  };

  const handleSignup = async () => {
    if (!validateSignupForm()) return;
    setIsLoading(true);

    const payload = {
      name: signupData.name.trim(),
      email: signupData.email.trim().toLowerCase(),
      password: signupData.password,
      mobile: signupData.mobile.trim(),
      location: signupData.location.trim(),
    };

    const result = await signup(payload);
    
    setIsLoading(false);
    if (result.success) {
      Alert.alert("Success", "Account created successfully! Please log in.");
      setAuthMode("login"); 
    } else {
      Alert.alert("Signup Failed", result.error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };
  
  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setLoginErrors({});
    setSignupErrors({});
  };

  // --- Renders ---

  const renderLoginForm = () => (
    <View style={styles.authCard}>
      <View style={styles.iconHeader}>
        <User size={60} color="#ea580c" />
      </View>
      <Text style={styles.authTitle}>Welcome Back</Text>
      <Text style={styles.authSubtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <Mail size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={loginData.email}
          onChangeText={(v) => setLoginData({ ...loginData, email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>
      {loginErrors.email && <Text style={styles.errorText}>{loginErrors.email}</Text>}

      <View style={styles.inputContainer}>
        <Lock size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={loginData.password}
          onChangeText={(v) => setLoginData({ ...loginData, password: v })}
          secureTextEntry
          editable={!isLoading}
        />
      </View>
      {loginErrors.password && <Text style={styles.errorText}>{loginErrors.password}</Text>}

      <TouchableOpacity 
        style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode} style={styles.switchContainer}>
        <Text style={styles.switchText}>
          Don't have an account? <Text style={styles.switchHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignupForm = () => (
    <View style={styles.authCard}>
      <View style={styles.iconHeader}>
        <User size={60} color="#ea580c" />
      </View>
      <Text style={styles.authTitle}>Create Account</Text>

      <View style={styles.inputContainer}>
        <User size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          value={signupData.name}
          onChangeText={(v) => setSignupData({ ...signupData, name: v })}
          editable={!isLoading}
        />
      </View>
      {signupErrors.name && <Text style={styles.errorText}>{signupErrors.name}</Text>}

      <View style={styles.inputContainer}>
        <Mail size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={signupData.email}
          onChangeText={(v) => setSignupData({ ...signupData, email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>
      {signupErrors.email && <Text style={styles.errorText}>{signupErrors.email}</Text>}

      <View style={styles.inputContainer}>
        <Phone size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Mobile"
          value={signupData.mobile}
          onChangeText={(v) => setSignupData({ ...signupData, mobile: v })}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!isLoading}
        />
      </View>
      {signupErrors.mobile && <Text style={styles.errorText}>{signupErrors.mobile}</Text>}

      <View style={styles.inputContainer}>
        <MapPin size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Location"
          value={signupData.location}
          onChangeText={(v) => setSignupData({ ...signupData, location: v })}
          editable={!isLoading}
        />
      </View>
      {signupErrors.location && <Text style={styles.errorText}>{signupErrors.location}</Text>}

      <View style={styles.inputContainer}>
        <Lock size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={signupData.password}
          onChangeText={(v) => setSignupData({ ...signupData, password: v })}
          secureTextEntry
          editable={!isLoading}
        />
      </View>
      {signupErrors.password && <Text style={styles.errorText}>{signupErrors.password}</Text>}

      <View style={styles.inputContainer}>
        <Lock size={20} color="#6b7280" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          value={signupData.confirmPassword}
          onChangeText={(v) => setSignupData({ ...signupData, confirmPassword: v })}
          secureTextEntry
          editable={!isLoading}
        />
      </View>
      {signupErrors.confirmPassword && <Text style={styles.errorText}>{signupErrors.confirmPassword}</Text>}

      <TouchableOpacity 
        style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.authButtonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleAuthMode} style={styles.switchContainer}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.switchHighlight}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Main Render ---
  
  // If NO user, show Auth screens
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#f3f4f6" barStyle="dark-content" />
        <ScrollView contentContainerStyle={styles.centerContent}>
          {authMode === "login" ? renderLoginForm() : renderSignupForm()}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If user EXISTS, show Profile
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ea580c" barStyle="light-content" />
      
      {/* Header */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <User size={32} color="#ea580c" />
            </View>
            <View>
              <Text style={styles.headerName}>{profileData.name}</Text>
              <Text style={styles.headerEmail}>{profileData.email}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.editButton}>
            <Edit2 size={18} color="#ea580c" />
            <Text style={styles.editButtonText}>{isEditing ? "Done" : "Edit"}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Personal Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.profileInput, !isEditing && styles.disabledInput]}
              value={profileData.name}
              onChangeText={(v) => setProfileData({ ...profileData, name: v })}
              editable={isEditing}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.profileInput, styles.disabledInput]}
              value={profileData.email}
              editable={false} // Email usually not editable
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.profileInput, !isEditing && styles.disabledInput]}
              value={profileData.phone}
              onChangeText={(v) => setProfileData({ ...profileData, phone: v })}
              editable={isEditing}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.prefRow}>
            <View style={styles.rowLeft}>
              <Globe size={22} color="#4b5563" />
              <Text style={styles.rowText}>Language</Text>
            </View>
            <Text style={styles.rowValue}>English</Text>
          </View>

          <View style={[styles.prefRow, { borderBottomWidth: 0 }]}>
            <View style={styles.rowLeft}>
              <Bell size={22} color="#4b5563" />
              <Text style={styles.rowText}>Push Notifications</Text>
            </View>
            <Switch
              value={profileData.notifications}
              onValueChange={(v) => setProfileData({ ...profileData, notifications: v })}
              trackColor={{ false: "#d1d5db", true: "#ea580c" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Activity */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Activity Summary</Text>
          <View style={styles.statRow}>
            <Camera size={24} color="#ea580c" />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Temples Visited</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <Heart size={24} color="#ea580c" />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Donations</Text>
              <Text style={styles.statValue}>₹5,250</Text>
            </View>
          </View>
          <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
            <TrendingUp size={24} color="#ea580c" />
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Trips Planned</Text>
              <Text style={styles.statValue}>8</Text>
            </View>
          </View>
        </View>

        {/* Menu Actions */}
        <View style={styles.sectionCard}>
          {[
            { icon: History, text: "Donation History" },
            { icon: Bookmark, text: "Saved Temples" },
            { icon: HelpCircle, text: "Help & Support" },
            { icon: Shield, text: "Privacy Policy" },
          ].map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.menuItem, idx === 3 && {borderBottomWidth: 0}]}>
              <View style={styles.rowLeft}>
                <item.icon size={20} color="#4b5563" />
                <Text style={styles.menuText}>{item.text}</Text>
              </View>
              <ChevronRight size={20} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Common
  container: { flex: 1, backgroundColor: "#f3f4f6" },
  centerContent: { flexGrow: 1, justifyContent: "center", padding: 20 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  
  // Auth Styles
  authCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 24,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5
  },
  iconHeader: { alignItems: "center", marginBottom: 20 },
  authTitle: { fontSize: 26, fontWeight: "bold", color: "#1f2937", textAlign: "center", marginBottom: 8 },
  authSubtitle: { fontSize: 16, color: "#6b7280", textAlign: "center", marginBottom: 24 },
  
  inputContainer: {
    flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 10,
    paddingHorizontal: 12, marginBottom: 12, height: 50
  },
  inputIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: "#1f2937", height: "100%" },
  errorText: { color: "#ef4444", fontSize: 12, marginBottom: 10, marginLeft: 4 },
  
  authButton: {
    backgroundColor: "#ea580c", borderRadius: 10, paddingVertical: 14,
    alignItems: "center", marginTop: 12
  },
  authButtonDisabled: { backgroundColor: "#fdba74" },
  authButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
  switchContainer: { marginTop: 20, alignItems: "center" },
  switchText: { color: "#6b7280", fontSize: 15 },
  switchHighlight: { color: "#ea580c", fontWeight: "bold" },

  // Profile Header
  headerContainer: { 
    backgroundColor: "#ea580c", 
    // Conditional padding for Android status bar
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
  },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginRight: 15 },
  headerName: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerEmail: { fontSize: 14, color: "#ffedd5" },
  editButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  editButtonText: { color: "#ea580c", fontWeight: "600", marginLeft: 4, fontSize: 14 },

  // Profile Sections
  sectionCard: {
    backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2937", marginBottom: 16 },
  
  infoRow: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 6 },
  profileInput: {
    borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10,
    fontSize: 16, color: "#1f2937", backgroundColor: "#fff"
  },
  disabledInput: { backgroundColor: "#f9fafb", color: "#6b7280" },

  prefRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f3f4f6"
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowText: { marginLeft: 12, fontSize: 16, color: "#374151" },
  rowValue: { color: "#6b7280", fontSize: 16 },

  statRow: {
    flexDirection: "row", alignItems: "center", paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: "#f3f4f6"
  },
  statInfo: { marginLeft: 15, flex: 1 },
  statLabel: { fontSize: 14, color: "#6b7280" },
  statValue: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },

  menuItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#f3f4f6"
  },
  menuText: { marginLeft: 12, fontSize: 16, color: "#1f2937" },

  logoutButton: {
    backgroundColor: "#dc2626", flexDirection: "row", justifyContent: "center", alignItems: "center",
    paddingVertical: 15, borderRadius: 12, marginTop: 10
  },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginLeft: 8 }
});