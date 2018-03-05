using UnityEngine;
using System;
using System.Collections.Generic;

using System.IO;
using System.Text;

public struct ImageEntry {
    public string name;
    public Sprite spr {get { return Resources.Load<Sprite>(name); }}
    public GameObject obj { get { return Resources.Load<GameObject>(name); } }}
public struct SoundEntry {
    public string name;
    public AudioClip snd { get { return Resources.Load<AudioClip>(name); } }}
public struct MaterialEntry {
    public string name;
    public Material mat { get { return Resources.Load<Material>(name); } }}
public class ImageSet {
    public ImageEntry[] files;
    public ImageSet(ImageEntry[] src) { files = src; }
    public Sprite rd(){ return files[UnityEngine.Random.Range(0, files.Length)].spr; }}
public class SoundSet {
    public SoundEntry[] files;
    public SoundSet(SoundEntry[] src) { files = src; }
    public AudioClip rd(){ return files[UnityEngine.Random.Range(0, files.Length)].snd; }}
public class AssetLister{
    static StringBuilder dirs = new StringBuilder("");
    static void DirWrite(int level, string s ){
        for ( var k = 0; k < level; k++ )dirs.Append('\t');
        dirs.Append(s);}
    static void DirSearch(string sDir, int level ){
        foreach (string d in Directory.GetDirectories(sDir)){
            DirWrite( level, "public static class " + Path.GetFileNameWithoutExtension(d) + "{\n");
            var files = new List<string>();
            var sndFiles = new List<string>();
            foreach (string f in Directory.GetFiles(d)){
                if (Path.GetExtension(f) == ".meta") continue;
                var s = f.Replace(Application.dataPath + Path.DirectorySeparatorChar + "Resources"+ Path.DirectorySeparatorChar, "");
                s = s.Replace("\\", "/");
                s = Path.ChangeExtension(s, null);
                var name = Path.GetFileNameWithoutExtension(f);
                name = name.Replace(" ", "_");
                if (Char.IsNumber(name[0])) name = "_" + name;
                if (Path.GetExtension(f) == ".png" || Path.GetExtension(f) == ".jpg" || Path.GetExtension(f) == ".tga" || Path.GetExtension(f) == ".prefab"){
                    DirWrite(level + 1, "public static ImageEntry " + name + " = new ImageEntry{ name = \"" + s + "\" };\n");
                    files.Add(name);}
                if (Path.GetExtension(f) == ".wav" || Path.GetExtension(f) == ".mp3"){
                    DirWrite(level + 1, "public static SoundEntry " + name + " = new SoundEntry{ name = \"" + s + "\" };\n");
                    sndFiles.Add(name);}
                if (Path.GetExtension(f) == ".mat"){
                    DirWrite(level + 1, "public static MaterialEntry " + name + " = new MaterialEntry{ name = \"" + s + "\" };\n");}}
            if (files.Count > 0){
                var fileList = "";
                for (var k = 0; k < files.Count; k++) fileList += (k == 0 ? "" : ", ") + files[k];
                DirWrite(level + 1, "public static ImageSet set = new ImageSet( new ImageEntry[]{ " + fileList + " } );\n");
                DirWrite(level + 1, "public static Sprite rand(){ return set.files[Random.Range(0, set.files.Length)].spr; }\n");}
            if (sndFiles.Count > 0){
                var fileList = "";
                for (var k = 0; k < sndFiles.Count; k++) fileList += (k == 0 ? "" : ", ") + sndFiles[k];
                DirWrite(level + 1, "public static SoundSet snds = new SoundSet( new SoundEntry[]{ " + fileList + " } );\n");
                DirWrite(level + 1, "public static AudioClip rand(){ return snds.files[Random.Range(0, snds.files.Length)].snd; }\n");}
            DirSearch(d, level+1);
            DirWrite(level, "}\n");}}
    public static void BuildFileList(){
        dirs.Append("using UnityEngine;\n\n public static class Art{\n");
        DirSearch(Application.dataPath + Path.DirectorySeparatorChar + "Resources", 1);
        dirs.Append("}");
        File.WriteAllText(Application.dataPath + Path.DirectorySeparatorChar + "Scripts\\CoreGame\\AssetSet.cs", dirs.ToString());}}