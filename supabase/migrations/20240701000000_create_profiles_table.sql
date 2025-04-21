-- 创建profiles表用于存储用户公开信息，与auth.users相关联
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  nickname TEXT,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 设置RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 允许所有用户查看profiles表
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- 允许用户更新自己的profile
CREATE POLICY "Users can update their own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 允许用户在注册时创建自己的profile
CREATE POLICY "Users can insert their own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 触发器：当auth.users创建时，自动创建profiles记录
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, nickname, avatar)
  VALUES (
    NEW.id, 
    split_part(NEW.email, '@', 1), -- 使用邮箱@前部分作为默认用户名
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), -- 使用meta中的名称或邮箱前缀
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '') -- 使用meta中的头像URL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 添加触发器到auth.users表
CREATE TRIGGER create_profile_after_user_create
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_profile_for_user();

-- 为现有用户创建profiles记录
INSERT INTO profiles (id, username, nickname, avatar)
SELECT 
  id,
  split_part(email, '@', 1),
  COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1)),
  COALESCE(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
ON CONFLICT (id) DO NOTHING; 