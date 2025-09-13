export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          athlete_id: string
          badge_name: string
          badge_type: string
          description: string | null
          earned_at: string
          id: string
          test_submission_id: string | null
        }
        Insert: {
          athlete_id: string
          badge_name: string
          badge_type: string
          description?: string | null
          earned_at?: string
          id?: string
          test_submission_id?: string | null
        }
        Update: {
          athlete_id?: string
          badge_name?: string
          badge_type?: string
          description?: string | null
          earned_at?: string
          id?: string
          test_submission_id?: string | null
        }
        Relationships: []
      }
      fitness_test_submissions: {
        Row: {
          ai_analysis: Json | null
          athlete_id: string
          id: string
          performance_metrics: Json | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["submission_status"] | null
          submitted_at: string
          test_type: Database["public"]["Enums"]["fitness_test_type"]
          video_url: string
        }
        Insert: {
          ai_analysis?: Json | null
          athlete_id: string
          id?: string
          performance_metrics?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string
          test_type: Database["public"]["Enums"]["fitness_test_type"]
          video_url: string
        }
        Update: {
          ai_analysis?: Json | null
          athlete_id?: string
          id?: string
          performance_metrics?: Json | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          submitted_at?: string
          test_type?: Database["public"]["Enums"]["fitness_test_type"]
          video_url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          full_name: string
          gender: string | null
          id: string
          is_verified: boolean | null
          phone: string | null
          preferred_language: string | null
          profile_image_url: string | null
          region: string | null
          role: Database["public"]["Enums"]["user_role"]
          sport_category: Database["public"]["Enums"]["sport_category"] | null
          updated_at: string
          user_id: string
          verification_document_url: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          full_name: string
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sport_category?: Database["public"]["Enums"]["sport_category"] | null
          updated_at?: string
          user_id: string
          verification_document_url?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          preferred_language?: string | null
          profile_image_url?: string | null
          region?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sport_category?: Database["public"]["Enums"]["sport_category"] | null
          updated_at?: string
          user_id?: string
          verification_document_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      fitness_test_type:
        | "vertical_jump"
        | "pushups"
        | "situps"
        | "squats"
        | "shuttle_run"
        | "endurance_run"
      sport_category:
        | "athletics"
        | "football"
        | "cricket"
        | "basketball"
        | "volleyball"
        | "other"
      submission_status: "pending" | "approved" | "rejected" | "processing"
      user_role: "athlete" | "official"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      fitness_test_type: [
        "vertical_jump",
        "pushups",
        "situps",
        "squats",
        "shuttle_run",
        "endurance_run",
      ],
      sport_category: [
        "athletics",
        "football",
        "cricket",
        "basketball",
        "volleyball",
        "other",
      ],
      submission_status: ["pending", "approved", "rejected", "processing"],
      user_role: ["athlete", "official"],
    },
  },
} as const
