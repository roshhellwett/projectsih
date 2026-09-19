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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      industry_interest: {
        Row: {
          created_at: string | null
          id: string
          industry_id: string | null
          interest_type: string | null
          message: string | null
          proposal_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          interest_type?: string | null
          message?: string | null
          proposal_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          industry_id?: string | null
          interest_type?: string | null
          message?: string | null
          proposal_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "industry_interest_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industry_interest_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          send_to: string | null
          sim: boolean | null
          text: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          send_to?: string | null
          sim?: boolean | null
          text?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          send_to?: string | null
          sim?: boolean | null
          text?: string | null
        }
        Relationships: []
      }
      problem_votes: {
        Row: {
          created_at: string | null
          problem_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          problem_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          problem_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_votes_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_votes_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems_with_votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          category: string | null
          created_at: string | null
          demo_votes: number | null
          description: string
          district: string | null
          duplicate_of: string | null
          embedding: string | null
          id: string
          latitude: number | null
          longitude: number | null
          photo_url: string | null
          priority_score: number | null
          routed_to: string | null
          status: string | null
          submitted_by: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          demo_votes?: number | null
          description: string
          district?: string | null
          duplicate_of?: string | null
          embedding?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          priority_score?: number | null
          routed_to?: string | null
          status?: string | null
          submitted_by?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          demo_votes?: number | null
          description?: string
          district?: string | null
          duplicate_of?: string | null
          embedding?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          priority_score?: number | null
          routed_to?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "problems_with_votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_routed_to_fkey"
            columns: ["routed_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          created_at: string | null
          funding_sought: number | null
          id: string
          problem_id: string | null
          proposal_text: string | null
          status: string | null
          team_members: string[] | null
          university_id: string | null
        }
        Insert: {
          created_at?: string | null
          funding_sought?: number | null
          id?: string
          problem_id?: string | null
          proposal_text?: string | null
          status?: string | null
          team_members?: string[] | null
          university_id?: string | null
        }
        Update: {
          created_at?: string | null
          funding_sought?: number | null
          id?: string
          problem_id?: string | null
          proposal_text?: string | null
          status?: string | null
          team_members?: string[] | null
          university_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems_with_votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          created_at: string | null
          domain_expertise: string[] | null
          email: string | null
          focus_areas: string[] | null
          id: string
          institution_name: string | null
          name: string
          phone: string | null
          role: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          domain_expertise?: string[] | null
          email?: string | null
          focus_areas?: string[] | null
          id?: string
          institution_name?: string | null
          name: string
          phone?: string | null
          role: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          domain_expertise?: string[] | null
          email?: string | null
          focus_areas?: string[] | null
          id?: string
          institution_name?: string | null
          name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      problems_with_votes: {
        Row: {
          category: string | null
          created_at: string | null
          demo_votes: number | null
          description: string | null
          district: string | null
          duplicate_of: string | null
          embedding: string | null
          id: string | null
          latitude: number | null
          longitude: number | null
          photo_url: string | null
          priority_score: number | null
          routed_to: string | null
          status: string | null
          submitted_by: string | null
          title: string | null
          votes: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          demo_votes?: number | null
          description?: string | null
          district?: string | null
          duplicate_of?: string | null
          embedding?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          priority_score?: number | null
          routed_to?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string | null
          votes?: never
        }
        Update: {
          category?: string | null
          created_at?: string | null
          demo_votes?: number | null
          description?: string | null
          district?: string | null
          duplicate_of?: string | null
          embedding?: string | null
          id?: string | null
          latitude?: number | null
          longitude?: number | null
          photo_url?: string | null
          priority_score?: number | null
          routed_to?: string | null
          status?: string | null
          submitted_by?: string | null
          title?: string | null
          votes?: never
        }
        Relationships: [
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "problems_with_votes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_routed_to_fkey"
            columns: ["routed_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problems_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      problem_vote_count: { Args: { p: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
