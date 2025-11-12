import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, login, logout, signup } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [showAuthForm, setShowAuthForm] = useState(!user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    location: "",
  });

  // Validation errors
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});

  // Profile data
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.mobile || "",
    language: "english",
    notifications: true,
  });

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation (Indian format)
  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  // Password validation
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Validate Login Form
  const validateLoginForm = () => {
    const errors = {};

    if (!loginData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(loginData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!loginData.password) {
      errors.password = "Password is required";
    }

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate Signup Form
  const validateSignupForm = () => {
    const errors = {};

    if (!signupData.name.trim()) {
      errors.name = "Name is required";
    } else if (signupData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!signupData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(signupData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (!validatePassword(signupData.password)) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!signupData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!signupData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!validateMobile(signupData.mobile)) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!signupData.location.trim()) {
      errors.location = "Location is required";
    } else if (signupData.location.trim().length < 2) {
      errors.location = "Location must be at least 2 characters";
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Login
  const handleLogin = async () => {
    if (!validateLoginForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        Alert.alert(
          "✅ Login Successful",
          `Welcome back, ${result.user.name}!`,
          [
            {
              text: "OK",
              onPress: () => {
                setShowAuthForm(false);
                setProfileData({
                  name: result.user.name,
                  email: result.user.email,
                  phone: result.user.mobile,
                  language: "english",
                  notifications: true,
                });
                setLoginData({ email: "", password: "" });
                setLoginErrors({});
              },
            },
          ]
        );
      } else {
        Alert.alert("❌ Login Failed", result.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async () => {
    if (!validateSignupForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const signupPayload = {
        name: signupData.name.trim(),
        email: signupData.email.trim().toLowerCase(),
        password: signupData.password,
        mobile: signupData.mobile.trim(),
        location: signupData.location.trim(),
      };

      const result = await signup(signupPayload);
      
      if (result.success) {
        Alert.alert(
          "🎉 Signup Successful",
          "Your account has been created successfully! Please login to continue.",
          [
            {
              text: "OK",
              onPress: () => {
                setAuthMode("login");
                setLoginData({
                  email: signupData.email.trim().toLowerCase(),
                  password: "",
                });
                setSignupData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                  mobile: "",
                  location: "",
                });
                setSignupErrors({});
              },
            },
          ]
        );
      } else {
        Alert.alert("❌ Signup Failed", result.error || "Unable to create account");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          logout();
          setShowAuthForm(true);
          setAuthMode("login");
          setLoginData({ email: "", password: "" });
          setSignupData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            mobile: "",
            location: "",
          });
        },
      },
    ]);
  };

  // Handle Save Profile
  const handleSaveProfile = () => {
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  // Switch between Login and Signup
  const toggleAuthMode = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
    setLoginErrors({});
    setSignupErrors({});
  };

  // Render Login Form
  const renderLoginForm = () => (
    <View style={styles.authFormContainer}>
      <Icon name="person" size={80} color="#FF6B35" />
      <Text style={styles.authTitle}>Welcome Back</Text>
      <Text style={styles.authSubtitle}>Sign in to continue</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={loginData.email}
          onChangeText={(value) => {
            setLoginData((prev) => ({ ...prev, email: value }));
            if (loginErrors.email) setLoginErrors((prev) => ({ ...prev, email: "" }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {loginErrors.email ? (
        <Text style={styles.errorText}>{loginErrors.email}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          value={loginData.password}
          onChangeText={(value) => {
            setLoginData((prev) => ({ ...prev, password: value }));
            if (loginErrors.password) setLoginErrors((prev) => ({ ...prev, password: "" }));
          }}
          secureTextEntry
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {loginErrors.password ? (
        <Text style={styles.errorText}>{loginErrors.password}</Text>
      ) : null}

      <TouchableOpacity 
        style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchAuthLink} 
        onPress={toggleAuthMode}
        disabled={isLoading}
      >
        <Text style={styles.switchAuthText}>
          Don't have an account? <Text style={styles.switchAuthHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render Signup Form
  const renderSignupForm = () => (
    <View style={styles.authFormContainer}>
      <Icon name="person-add" size={80} color="#FF6B35" />
      <Text style={styles.authTitle}>Create Account</Text>
      <Text style={styles.authSubtitle}>Sign up to get started</Text>

      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Full Name"
          value={signupData.name}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, name: value }));
            if (signupErrors.name) setSignupErrors((prev) => ({ ...prev, name: "" }));
          }}
          autoCapitalize="words"
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.name ? (
        <Text style={styles.errorText}>{signupErrors.name}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          value={signupData.email}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, email: value }));
            if (signupErrors.email) setSignupErrors((prev) => ({ ...prev, email: "" }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.email ? (
        <Text style={styles.errorText}>{signupErrors.email}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Mobile Number (10 digits)"
          value={signupData.mobile}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, mobile: value }));
            if (signupErrors.mobile) setSignupErrors((prev) => ({ ...prev, mobile: "" }));
          }}
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.mobile ? (
        <Text style={styles.errorText}>{signupErrors.mobile}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Location"
          value={signupData.location}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, location: value }));
            if (signupErrors.location) setSignupErrors((prev) => ({ ...prev, location: "" }));
          }}
          autoCapitalize="words"
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.location ? (
        <Text style={styles.errorText}>{signupErrors.location}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Password (min 6 characters)"
          value={signupData.password}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, password: value }));
            if (signupErrors.password) setSignupErrors((prev) => ({ ...prev, password: "" }));
          }}
          secureTextEntry
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.password ? (
        <Text style={styles.errorText}>{signupErrors.password}</Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          value={signupData.confirmPassword}
          onChangeText={(value) => {
            setSignupData((prev) => ({ ...prev, confirmPassword: value }));
            if (signupErrors.confirmPassword) setSignupErrors((prev) => ({ ...prev, confirmPassword: "" }));
          }}
          secureTextEntry
          placeholderTextColor="#999"
          editable={!isLoading}
        />
      </View>
      {signupErrors.confirmPassword ? (
        <Text style={styles.errorText}>{signupErrors.confirmPassword}</Text>
      ) : null}

      <TouchableOpacity 
        style={[styles.authButton, isLoading && styles.authButtonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchAuthLink} 
        onPress={toggleAuthMode}
        disabled={isLoading}
      >
        <Text style={styles.switchAuthText}>
          Already have an account? <Text style={styles.switchAuthHighlight}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // If not logged in, show auth forms
  if (showAuthForm) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {authMode === "login" ? renderLoginForm() : renderSignupForm()}
      </ScrollView>
    );
  }

  // Profile Screen (when logged in)
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={50} color="#fff" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileData.name}</Text>
          <Text style={styles.profileEmail}>{profileData.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon name={isEditing ? "check" : "edit"} size={20} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      {/* Profile Form */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.profileInput, !isEditing && styles.disabledInput]}
            value={profileData.name}
            onChangeText={(value) =>
              setProfileData((prev) => ({ ...prev, name: value }))
            }
            editable={isEditing}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.profileInput, !isEditing && styles.disabledInput]}
            value={profileData.email}
            onChangeText={(value) =>
              setProfileData((prev) => ({ ...prev, email: value }))
            }
            editable={isEditing}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={[styles.profileInput, !isEditing && styles.disabledInput]}
            value={profileData.phone}
            onChangeText={(value) =>
              setProfileData((prev) => ({ ...prev, phone: value }))
            }
            editable={isEditing}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
        </View>

        {isEditing && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Preferences */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Icon name="language" size={24} color="#666" />
            <Text style={styles.preferenceLabel}>Language</Text>
          </View>
          <Text style={styles.preferenceValue}>English</Text>
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Icon name="notifications" size={24} color="#666" />
            <Text style={styles.preferenceLabel}>Push Notifications</Text>
          </View>
          <Switch
            value={profileData.notifications}
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, notifications: value }))
            }
            trackColor={{ false: "#E0E0E0", true: "#FF6B35" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Activity Summary */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Activity Summary</Text>

        <View style={styles.activityRow}>
          <Icon name="temple-hindu" size={24} color="#FF6B35" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityLabel}>Temples Visited</Text>
            <Text style={styles.activityValue}>12</Text>
          </View>
        </View>

        <View style={styles.activityRow}>
          <Icon name="favorite" size={24} color="#FF6B35" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityLabel}>Total Donations</Text>
            <Text style={styles.activityValue}>₹5,250</Text>
          </View>
        </View>

        <View style={styles.activityRow}>
          <Icon name="flight" size={24} color="#FF6B35" />
          <View style={styles.activityInfo}>
            <Text style={styles.activityLabel}>Trips Planned</Text>
            <Text style={styles.activityValue}>8</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="history" size={20} color="#666" />
          <Text style={styles.actionText}>Donation History</Text>
          <Icon name="arrow-forward-ios" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="bookmark" size={20} color="#666" />
          <Text style={styles.actionText}>Saved Temples</Text>
          <Icon name="arrow-forward-ios" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="help" size={20} color="#666" />
          <Text style={styles.actionText}>Help & Support</Text>
          <Icon name="arrow-forward-ios" size={16} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Icon name="privacy-tip" size={20} color="#666" />
          <Text style={styles.actionText}>Privacy Policy</Text>
          <Icon name="arrow-forward-ios" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  authFormContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  authTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 4,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    color: "#E53E3E",
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
    alignSelf: "flex-start",
    width: "100%",
  },
  authButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  authButtonDisabled: {
    backgroundColor: "#FFB399",
  },
  authButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchAuthLink: {
    marginTop: 20,
  },
  switchAuthText: {
    color: "#666",
    fontSize: 16,
  },
  switchAuthHighlight: {
    color: "#FF6B35",
    fontWeight: "bold",
  },
  profileHeader: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  profileInput: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#F5F5F5",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  preferenceLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  preferenceValue: {
    fontSize: 16,
    color: "#666",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  activityLabel: {
    fontSize: 14,
    color: "#666",
  },
  activityValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  actionContainer: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  actionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#E53E3E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    margin: 16,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});