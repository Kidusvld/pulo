export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      feedback: {
        Row: {
          created_at: string
          email: string | null
          feedback_type: string
          id: string
          message: string
          page_url: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          feedback_type: string
          id?: string
          message: string
          page_url?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          feedback_type?: string
          id?: string
          message?: string
          page_url?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      muscle_group_tracking: {
        Row: {
          created_at: string
          id: string
          muscle_group: Database["public"]["Enums"]["muscle_group"]
          progress_tracking_id: string | null
          sets_completed: number | null
          total_volume: number | null
          total_weight: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          muscle_group: Database["public"]["Enums"]["muscle_group"]
          progress_tracking_id?: string | null
          sets_completed?: number | null
          total_volume?: number | null
          total_weight?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          muscle_group?: Database["public"]["Enums"]["muscle_group"]
          progress_tracking_id?: string | null
          sets_completed?: number | null
          total_volume?: number | null
          total_weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_progress_tracking"
            columns: ["progress_tracking_id"]
            isOneToOne: false
            referencedRelation: "progress_tracking"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "muscle_group_tracking_progress_tracking_id_fkey"
            columns: ["progress_tracking_id"]
            isOneToOne: false
            referencedRelation: "progress_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          email: string | null
          first_name: string | null
          free_plan_generated: boolean | null
          id: string
          intensity_level: string | null
          last_name: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          free_plan_generated?: boolean | null
          id: string
          intensity_level?: string | null
          last_name?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          age?: number | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          free_plan_generated?: boolean | null
          id?: string
          intensity_level?: string | null
          last_name?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      progress_tracking: {
        Row: {
          completed_exercises: Json | null
          created_at: string
          date: string | null
          energy_level: number | null
          id: string
          mood: string | null
          notes: string | null
          total_volume: number | null
          user_id: string
          weight: number | null
          workout_duration: number | null
        }
        Insert: {
          completed_exercises?: Json | null
          created_at?: string
          date?: string | null
          energy_level?: number | null
          id?: string
          mood?: string | null
          notes?: string | null
          total_volume?: number | null
          user_id: string
          weight?: number | null
          workout_duration?: number | null
        }
        Update: {
          completed_exercises?: Json | null
          created_at?: string
          date?: string | null
          energy_level?: number | null
          id?: string
          mood?: string | null
          notes?: string | null
          total_volume?: number | null
          user_id?: string
          weight?: number | null
          workout_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_workout_plans: {
        Row: {
          id: string
          name: string | null
          plan_data: Json
          saved_at: string | null
          targeted_body_parts: string[] | null
          user_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          plan_data: Json
          saved_at?: string | null
          targeted_body_parts?: string[] | null
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          plan_data?: Json
          saved_at?: string | null
          targeted_body_parts?: string[] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_events: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          stripe_event_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_data: Json
          event_type: string
          id?: string
          stripe_event_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          stripe_event_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscription_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          adjustments: Json | null
          created_at: string
          equipment: string[] | null
          feedback: string | null
          fitness_goal: Database["public"]["Enums"]["fitness_goal"]
          id: string
          intensity_level: Database["public"]["Enums"]["intensity_level"]
          is_active: boolean | null
          plan_data: Json
          targeted_body_parts: string[] | null
          user_id: string
          workout_frequency: number
          workout_location: Database["public"]["Enums"]["workout_location"]
        }
        Insert: {
          adjustments?: Json | null
          created_at?: string
          equipment?: string[] | null
          feedback?: string | null
          fitness_goal: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          intensity_level?: Database["public"]["Enums"]["intensity_level"]
          is_active?: boolean | null
          plan_data: Json
          targeted_body_parts?: string[] | null
          user_id: string
          workout_frequency: number
          workout_location?: Database["public"]["Enums"]["workout_location"]
        }
        Update: {
          adjustments?: Json | null
          created_at?: string
          equipment?: string[] | null
          feedback?: string | null
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"]
          id?: string
          intensity_level?: Database["public"]["Enums"]["intensity_level"]
          is_active?: boolean | null
          plan_data?: Json
          targeted_body_parts?: string[] | null
          user_id?: string
          workout_frequency?: number
          workout_location?: Database["public"]["Enums"]["workout_location"]
        }
        Relationships: [
          {
            foreignKeyName: "workout_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      body_part:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "forearms"
        | "abs"
        | "lower_back"
        | "glutes"
        | "quadriceps"
        | "hamstrings"
        | "calves"
      fitness_goal: "build_muscle" | "lose_fat" | "increase_mobility"
      intensity_level: "beginner" | "intermediate" | "advanced"
      muscle_group:
        | "chest"
        | "back"
        | "legs"
        | "shoulders"
        | "arms"
        | "core"
        | "full_body"
        | "cardio"
      subscription_status: "free" | "premium"
      workout_location: "home" | "gym"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      body_part: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "forearms",
        "abs",
        "lower_back",
        "glutes",
        "quadriceps",
        "hamstrings",
        "calves",
      ],
      fitness_goal: ["build_muscle", "lose_fat", "increase_mobility"],
      intensity_level: ["beginner", "intermediate", "advanced"],
      muscle_group: [
        "chest",
        "back",
        "legs",
        "shoulders",
        "arms",
        "core",
        "full_body",
        "cardio",
      ],
      subscription_status: ["free", "premium"],
      workout_location: ["home", "gym"],
    },
  },
} as const
