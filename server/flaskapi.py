from flask import Flask, json
from imageai.Detection import VideoObjectDetection
import os


def forFrame(frame_number, output_array, output_count):
    # print("<p>FOR FRAME ", frame_number)
    # print("Output for each object : ", output_array)
    print("unique objects : ", output_count)
    print("\n")


def forSeconds(second_number, output_arrays, count_arrays, average_output_count):
    print("SECOND : ", second_number)
    # print("Array for the outputs of each frame ", output_arrays)
    # print("Array for output count for unique objects in each frame : ", count_arrays)
    print("Output average count for unique objects in the last second: ",
          average_output_count)
    print("\n\n")


def forMinute(minute_number, output_arrays, count_arrays, average_output_count):
    print("MINUTE : ", minute_number)
    # print("Array for the outputs of each frame ", output_arrays)
    # print("Array for output count for unique objects in each frame : ", count_arrays)
    print("Output average count for unique objects in the last minute: ",
          average_output_count)
    print("\n\n\n")


def forFull(output_arrays, count_arrays, average_output_count):
    # print("Array for the outputs of each frame ", output_arrays)
    # print("Array for output count for unique objects in each frame : ", count_arrays)
    print("Output average count for unique objects in the entire video: ",
          average_output_count)
    print("------------END OF THE VIDEO --------------")


companies = [{"id": 1, "name": "Company One"},
    {"id": 2, "name": "Company Two"}]

api = Flask(__name__)
execution_path = os.getcwd()



class MyDetector:
    myDetector = None
    def __init__(self):
        execution_path = os.getcwd()
        self.myDetector = VideoObjectDetection()
        # self.myDetector.setModelTypeAsYOLOv3()
        # self.myDetector.setModelPath(os.path.join(execution_path, "yolo.h5"))
        #self.myDetector.loadModel(detection_speed="flash")

    def process_ml(self):
        execution_path = os.getcwd()
        self.myDetector = VideoObjectDetection()
        self.myDetector.setModelTypeAsYOLOv3()
        self.myDetector.setModelPath(os.path.join(execution_path, "yolo.h5"))
        self.myDetector.loadModel(detection_speed="flash")
        video_path = self.myDetector.detectObjectsFromVideo(input_file_path=os.path.join(execution_path, "input.mp4"),
                                                output_file_path=os.path.join(execution_path, "upload/output_detected_1"), frames_per_second=29,
                                                
                                                per_frame_function=forFrame,
                                                per_second_function=forSeconds,
                                                per_minute_function=forMinute,
                                                video_complete_function=forFull,
                                                
                                                minimum_percentage_probability=10,

                                                log_progress=True)
        return video_path



myDetector = MyDetector()


@api.route('/companies', methods=['GET'])
def get_companies():
    
    print(execution_path)
    video_path = myDetector.process_ml()
    print(video_path)
    return json.dumps(companies)

if __name__ == '__main__':
    api.run()
