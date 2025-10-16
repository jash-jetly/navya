/*
  # Precode Database Schema

  ## Overview
  Creates the complete database schema for precode - an AI-powered product planning tool.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `onboarding_complete` (boolean, default false)
  - `preferred_app_types` (text) - Stores user's preferred app categories
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `ideas`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `description` (text)
  - `status` (text) - flow, wireframe, app, monitor
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_flows`
  - `id` (uuid, primary key)
  - `idea_id` (uuid, references ideas)
  - `flow_data` (jsonb) - Stores flow diagram structure
  - `created_at` (timestamptz)

  ### `wireframes`
  - `id` (uuid, primary key)
  - `idea_id` (uuid, references ideas)
  - `wireframe_data` (jsonb) - Stores wireframe layout structure
  - `created_at` (timestamptz)

  ### `app_builds`
  - `id` (uuid, primary key)
  - `idea_id` (uuid, references ideas)
  - `screens` (jsonb) - Stores screen definitions
  - `created_at` (timestamptz)

  ### `analytics`
  - `id` (uuid, primary key)
  - `idea_id` (uuid, references ideas)
  - `metrics` (jsonb) - Stores analytics data (clicks, drop-offs, etc)
  - `created_at` (timestamptz)

  ### `ai_suggestions`
  - `id` (uuid, primary key)
  - `idea_id` (uuid, references ideas)
  - `suggestion_text` (text)
  - `suggestion_type` (text) - design, ux, performance, etc
  - `status` (text) - pending, applied, ignored
  - `created_at` (timestamptz)

  ### `user_preferences`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `preference_key` (text) - e.g., "cta_color", "layout_style"
  - `preference_value` (text)
  - `learned_from` (uuid) - references ai_suggestions if learned from a suggestion
  - `created_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Authenticated users only

  ## 3. Important Notes
  - All tables use UUID primary keys with auto-generation
  - Timestamps use timestamptz for timezone awareness
  - JSONB columns for flexible data storage
  - Foreign key constraints ensure data integrity
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  onboarding_complete boolean DEFAULT false,
  preferred_app_types text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'flow',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ideas"
  ON ideas FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON ideas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON ideas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON ideas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create user_flows table
CREATE TABLE IF NOT EXISTS user_flows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  flow_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_flows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own flows"
  ON user_flows FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = user_flows.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own flows"
  ON user_flows FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = user_flows.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Create wireframes table
CREATE TABLE IF NOT EXISTS wireframes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  wireframe_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wireframes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wireframes"
  ON wireframes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = wireframes.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own wireframes"
  ON wireframes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = wireframes.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Create app_builds table
CREATE TABLE IF NOT EXISTS app_builds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  screens jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own app builds"
  ON app_builds FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = app_builds.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own app builds"
  ON app_builds FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = app_builds.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  metrics jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = analytics.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analytics"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = analytics.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Create ai_suggestions table
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  suggestion_text text NOT NULL,
  suggestion_type text DEFAULT 'general',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own suggestions"
  ON ai_suggestions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = ai_suggestions.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own suggestions"
  ON ai_suggestions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = ai_suggestions.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own suggestions"
  ON ai_suggestions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = ai_suggestions.idea_id
      AND ideas.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = ai_suggestions.idea_id
      AND ideas.user_id = auth.uid()
    )
  );

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  preference_key text NOT NULL,
  preference_value text NOT NULL,
  learned_from uuid REFERENCES ai_suggestions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_user_flows_idea_id ON user_flows(idea_id);
CREATE INDEX IF NOT EXISTS idx_wireframes_idea_id ON wireframes(idea_id);
CREATE INDEX IF NOT EXISTS idx_app_builds_idea_id ON app_builds(idea_id);
CREATE INDEX IF NOT EXISTS idx_analytics_idea_id ON analytics(idea_id);
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_idea_id ON ai_suggestions(idea_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);