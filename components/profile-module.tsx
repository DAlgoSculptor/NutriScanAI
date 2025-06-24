"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { User, Settings, Bell, Shield, Globe, Award } from "lucide-react"

interface ProfileModuleProps {
  user: any
  setUser: (user: any) => void
}

export function ProfileModule({ user, setUser }: ProfileModuleProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    preferences: {
      language: "en",
      notifications: true,
      publicProfile: false,
      dietaryRestrictions: [] as string[],
    },
  })

  useEffect(() => {
    if (user) {
      setProfile(user)
    }
  }, [user])

  const handleSignIn = () => {
    // Simulate sign in
    const newUser = {
      id: "user_" + Date.now(),
      name: "Demo User",
      email: "demo@nutriscan.com",
      joinDate: new Date(),
      preferences: {
        language: "en",
        notifications: true,
        publicProfile: false,
        dietaryRestrictions: [],
      },
      stats: {
        totalScans: 0,
        avgScore: 0,
        streak: 0,
      },
    }
    setUser(newUser)
    localStorage.setItem("nutriscan_user", JSON.stringify(newUser))
  }

  const handleSignOut = () => {
    setUser(null)
    localStorage.removeItem("nutriscan_user")
  }

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...profile }
    setUser(updatedUser)
    localStorage.setItem("nutriscan_user", JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  const toggleDietaryRestriction = (restriction: string) => {
    const current = profile.preferences.dietaryRestrictions
    const updated = current.includes(restriction) ? current.filter((r) => r !== restriction) : [...current, restriction]

    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        dietaryRestrictions: updated,
      },
    })
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome to NutriScan</h3>
          <p className="text-gray-500 mb-6">Sign in to access personalized features and save your scan history</p>
          <Button onClick={handleSignIn}>Sign In / Create Account</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                {isEditing ? (
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                ) : (
                  <p className="text-lg">{profile.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                {isEditing ? (
                  <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                ) : (
                  <p className="text-lg">{profile.email}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                Save Changes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2" />
            Your Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{user.stats?.totalScans || 0}</div>
              <div className="text-sm text-blue-700">Total Scans</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user.stats?.avgScore || 0}/100</div>
              <div className="text-sm text-green-700">Avg Score</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{user.stats?.streak || 0}</div>
              <div className="text-sm text-purple-700">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Language */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Language</span>
              </div>
              <Badge>{profile.preferences.language === "en" ? "English" : profile.preferences.language}</Badge>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                <span className="font-medium">Health Alerts</span>
              </div>
              <Switch
                checked={profile.preferences.notifications}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, notifications: checked },
                  })
                }
              />
            </div>

            {/* Public Profile */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Public Profile</span>
              </div>
              <Switch
                checked={profile.preferences.publicProfile}
                onCheckedChange={(checked) =>
                  setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, publicProfile: checked },
                  })
                }
              />
            </div>

            {/* Dietary Restrictions */}
            <div>
              <h4 className="font-medium mb-3">Dietary Restrictions</h4>
              <div className="flex flex-wrap gap-2">
                {["Gluten-Free", "Dairy-Free", "Vegan", "Vegetarian", "Keto", "Low-Sodium"].map((restriction) => (
                  <Badge
                    key={restriction}
                    variant={profile.preferences.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDietaryRestriction(restriction)}
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Export My Data
            </Button>
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
            <Button variant="destructive" onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
